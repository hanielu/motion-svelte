import { Feature } from "#lib/features/feature.js";
import type { MotionState } from "#lib/state/motion-state.js";
import { addScaleCorrector, globalProjectionState } from "motion-dom";
import { defaultScaleCorrector } from "./config.js";
import { isDef } from "#lib/vendor/runed/index.js";
import type { Options } from "#lib/types/index.js";
import { isHidden } from "#lib/utils/is-hidden.js";

let hasLayoutUpdate = false;
/**
 * Set by the first snapshot or unmount. From then on newly mounted nodes are measured right away, so a later layout
 * change has a layout to animate from (as in upstream's MeasureLayout).
 */
let hasTakenAnySnapshot = false;

export class LayoutFeature extends Feature {
	static key = "layout" as const;

	constructor(state: MotionState) {
		super(state);
		addScaleCorrector(defaultScaleCorrector);
		state.getSnapshot = this.getSnapshot.bind(this);
		state.didUpdate = this.didUpdate.bind(this);
	}

	private updatePrevLead(projection: NonNullable<typeof this.state.visualElement.projection>) {
		const stack = projection.getStack();
		if (stack?.prevLead) {
			if (!stack.prevLead.snapshot) {
				stack.prevLead.willUpdate();
			}
			hasLayoutUpdate = true;
		}
	}

	didUpdate() {
		if (!hasLayoutUpdate) return;
		if (this.state.options.layout || this.state.options.layoutId || this.state.options.drag) {
			hasLayoutUpdate = false;
			this.state.visualElement.projection?.root?.didUpdate();
		}
	}

	mount() {
		const options = this.state.options;
		const layoutGroup = this.state.options.layoutGroup;
		if (options.layout || options.layoutId) {
			const projection = this.state.visualElement.projection;
			if (options.layoutId) {
				const isPresent = !isHidden(this.state.element as HTMLElement);
				projection.isPresent = isPresent;
				if (isPresent) {
					// Svelte mounts an element before removing the one it replaces. Snapshot that one while it's still on
					// the page, before promoting, so this element animates from it as in React.
					const lead = projection.getStack()?.lead;
					if (lead && lead !== projection && lead.instance && !lead.snapshot) lead.willUpdate();
					projection.promote();
				} else {
					projection.relegate();
				}
				this.updatePrevLead(projection);
			}
			layoutGroup?.group?.add(projection);
			globalProjectionState.hasEverUpdated = true;
		}
		if (hasTakenAnySnapshot) hasLayoutUpdate = true;
		this.didUpdate();
	}

	unmount() {
		hasTakenAnySnapshot = true;
		const layoutGroup = this.state.options.layoutGroup;
		const projection = this.state.visualElement.projection;

		if (projection) {
			if (layoutGroup?.group && (this.state.options.layout || this.state.options.layoutId)) {
				layoutGroup.group.remove(projection);
			}
			// when layoutId is set, unMount will update the layout
			if (this.state.options.layoutId) {
				projection.scheduleCheckAfterUnmount();
			} else {
				this.didUpdate();
			}
		}
	}

	getSnapshot(newOptions: Options, isPresent?: boolean): void {
		const projection = this.state.visualElement.projection;
		const { drag, layout, layoutId } = newOptions;
		if (!projection || (!layout && !layoutId && !drag)) {
			return;
		}

		hasLayoutUpdate = hasTakenAnySnapshot = true;

		/**
		 * Snapshot the current layout.
		 *
		 * Unlike Vue, we can't gate this on a layoutDependency comparison: in the
		 * Svelte port, getSnapshot always runs from an *explicit* pre-update trigger
		 * (createLayoutMotion().update() or presence transitions) before the state
		 * change has been applied, so old and new options are the same object and a
		 * dependency comparison can never detect a change. The explicit trigger is
		 * itself the opt-in, so snapshot unconditionally.
		 */
		if (drag || !isDef(isPresent) || projection.isPresent !== isPresent) {
			projection.willUpdate();
		}

		/**
		 * If the isPresent has changed, we need to update the projection
		 * and promote or relegate the projection accordingly
		 */
		if (isDef(isPresent) && isPresent !== projection.isPresent) {
			projection.isPresent = isPresent;
			// Only the lead hands the layout on, and only a follower takes it back: a relegating follower would hand
			// the lead to another member, and repeated open/close cycles would drift the stack.
			if (isPresent) {
				if (!projection.isLead()) projection.promote();
				this.updatePrevLead(projection);
			} else if (projection.isLead()) {
				projection.relegate();
			}
		}
	}
}
