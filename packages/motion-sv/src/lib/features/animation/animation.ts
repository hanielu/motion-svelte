import { Feature } from "#lib/features/feature.js";
import { createAnimationState, isAnimationControls, microtask } from "motion-dom";
import type { MotionState } from "#lib/state/motion-state.js";

const STATE_TYPES = [
	"initial",
	"animate",
	"whileInView",
	"whileHover",
	"whilePress",
	"whileDrag",
	"whileFocus",
	"exit",
] as const;
export type StateType = (typeof STATE_TYPES)[number];

export class AnimationFeature extends Feature {
	static key = "animation" as const;

	unmountControls?: () => void;

	constructor(state: MotionState) {
		super(state);
		// Create animation state with visualElement (aligned with motion-dom signature)
		const ve = state.visualElement;
		ve.animationState ||= createAnimationState(ve);
	}

	updateAnimationControlsSubscription() {
		const { animate } = this.state.options;
		if (isAnimationControls(animate)) {
			this.unmountControls = animate.subscribe(this.state.visualElement);
		}
	}

	/**
	 * Subscribe any provided AnimationControls to the component's VisualElement
	 */
	mount() {
		/**
		 * Defer the initial animation pass by one microtask so the whole subtree
		 * has mounted first. Unlike Vue (children mount before parents), Svelte
		 * mounts parents before children, so a variant-controlling parent would
		 * otherwise run animateChanges() before its variantChildren have
		 * registered — breaking orchestration (staggerChildren, delayChildren,
		 * when: "beforeChildren"/"afterChildren").
		 *
		 * Note: Vue's port also checks `isHidden(element)` here to support
		 * v-show. Svelte has no v-show equivalent, and our AnimatePresence
		 * wait-mode gate hides entrants with display:none, which must NOT be
		 * treated as exiting — so that check is intentionally omitted.
		 */
		microtask.render(() => {
			if (!this.state.isMounted()) return;
			if (this.state.isEnterBlocked?.()) {
				// AnimatePresence wait-mode: hold initial values; the Motion component
				// re-activates "animate" when the gate opens.
				this.state.setActiveNoAnimate("animate", false);
				return;
			}
			this.state.visualElement.animationState?.animateChanges();
		});
		this.updateAnimationControlsSubscription();
	}

	update() {
		this.state.visualElement.animationState?.animateChanges();
		const { animate } = this.state.visualElement.getProps();
		const { animate: prevAnimate } = this.state.visualElement.prevProps || {};
		if (animate !== prevAnimate) {
			this.updateAnimationControlsSubscription();
		}
	}

	unmount() {
		this.state.visualElement.animationState!.reset();
		this.unmountControls?.();
	}
}
