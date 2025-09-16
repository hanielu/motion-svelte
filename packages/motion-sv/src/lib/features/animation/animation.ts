import { isAnimationControls } from "@/animation/utils.js";
import type { AnimateUpdates } from "@/features/animation/types.js";
import { Feature } from "@/features/feature.js";
import { type MotionState, mountedStates } from "@/state/index.js";
import { visualElementStore } from "framer-motion/dist/es/render/store.mjs";
import { motionEvent } from "@/state/event.js";
import { style } from "@/state/style.js";
import { transformResetValue } from "@/state/transform.js";
import { hasChanged, resolveVariant } from "@/state/utils.js";
import type { $Transition, AnimationFactory, Options, VariantType } from "@/types/index.js";
import { isDef } from "runed";
import type { VisualElement } from "framer-motion";
import { noop } from "framer-motion/dom";
import { animateVisualElement } from "framer-motion/dist/es/animation/interfaces/visual-element.mjs";
import { createVisualElement } from "@/state/create-visual-element.js";
import { prefersReducedMotion } from "framer-motion/dist/es/utils/reduced-motion/state.mjs";
import { calcChildStagger } from "@/features/animation/calc-child-stagger.js";

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
	unmountControls?: () => void;
	constructor(state: MotionState) {
		super(state);
		// Create visual element with initial config
		this.state.visualElement = createVisualElement(this.state.options.as!, {
			presenceContext: null,
			parent: this.state.parent?.visualElement,
			props: {
				...this.state.options,
				whileTap: this.state.options.whilePress,
			},
			visualState: {
				renderState: {
					transform: {},
					transformOrigin: {},
					style: {},
					vars: {},
					attrs: {},
				},
				latestValues: {
					...this.state.baseTarget,
				},
			},
			reducedMotionConfig: this.state.options.motionConfig.reducedMotion,
		});
		this.state.visualElement.parent?.addChild(this.state.visualElement);
		this.state.animateUpdates = this.animateUpdates;
		if (this.state.isMounted()) this.state.startAnimation();
	}

	updateAnimationControlsSubscription() {
		const { animate } = this.state.options;
		if (isAnimationControls(animate)) {
			this.unmountControls = animate.subscribe(this.state);
		}
	}

	animateUpdates: AnimateUpdates = ({
		controlActiveState,
		directAnimate,
		directTransition,
		controlDelay = 0,
		isExit,
	} = {}) => {
		// check if the user has reduced motion
		const { reducedMotion } = this.state.options.motionConfig;
		this.state.visualElement.shouldReduceMotion =
			reducedMotion === "always" || (reducedMotion === "user" && !!prefersReducedMotion.current);

		const prevTarget = this.state.target;
		this.state.target = { ...this.state.baseTarget };
		let animationOptions: $Transition = {};

		animationOptions = this.resolveStateAnimation({
			controlActiveState,
			directAnimate,
			directTransition,
		});
		// The final transition to be applied to the state
		this.state.finalTransition = animationOptions;

		const factories = this.createAnimationFactories(prevTarget, animationOptions, controlDelay);
		const { getChildAnimations } = this.setupChildAnimations(animationOptions, this.state.activeStates);
		return this.executeAnimations({
			factories,
			getChildAnimations,
			transition: animationOptions,
			controlActiveState,
			isExit,
		});
	};

	executeAnimations({
		factories,
		getChildAnimations,
		transition,
		controlActiveState,
		isExit = false,
	}: {
		factories: AnimationFactory[];
		getChildAnimations: () => Promise<any>;
		transition: $Transition | undefined;
		controlActiveState: Partial<Record<string, boolean>> | undefined;
		isExit: boolean;
	}) {
		const getAnimation = () => Promise.all(factories.map((factory) => factory()).filter(Boolean));

		const animationTarget = { ...this.state.target };
		const element = this.state.element;

		/**
		 * Finish the animation and dispatch events
		 */
		const finishAnimation = (animationPromise: Promise<any>) => {
			element.dispatchEvent(motionEvent("motionstart", animationTarget));
			this.state.options.onAnimationStart?.(animationTarget);
			animationPromise
				.then(() => {
					element.dispatchEvent(motionEvent("motioncomplete", animationTarget, isExit));
					this.state.options.onAnimationComplete?.(animationTarget);
				})
				.catch(noop);
		};

		/**
		 * Get the animation promise
		 */
		const getAnimationPromise = () => {
			const animationPromise = transition?.when
				? (transition.when === "beforeChildren" ? getAnimation() : getChildAnimations()).then(() =>
						transition.when === "beforeChildren" ? getChildAnimations() : getAnimation()
					)
				: Promise.all([getAnimation(), getChildAnimations()]);

			finishAnimation(animationPromise);
			return animationPromise;
		};

		return controlActiveState ? getAnimationPromise : getAnimationPromise();
	}

	/**
	 * Setup child animations
	 */
	setupChildAnimations(
		transition: $Transition | undefined,
		controlActiveState: Partial<Record<string, boolean>> | undefined
	) {
		const visualElement = this.state.visualElement;
		if (!visualElement.variantChildren?.size || !controlActiveState)
			return { getChildAnimations: () => Promise.resolve() };

		const { staggerChildren = 0, staggerDirection = 1, delayChildren = 0 } = transition || {};
		const numChildren = visualElement.variantChildren.size;
		const maxStaggerDuration = (numChildren - 1) * staggerChildren;
		const delayIsFunction = typeof delayChildren === "function";
		const generateStaggerDuration = delayIsFunction
			? (i: number) => delayChildren(i, numChildren)
			: // Support deprecated staggerChildren,will be removed in next major version
				staggerDirection === 1
				? (i = 0) => i * staggerChildren
				: (i = 0) => maxStaggerDuration - i * staggerChildren;

		const childAnimations = Array.from(visualElement.variantChildren).map(
			(child: VisualElement & { state: MotionState }, index) => {
				return child.state.animateUpdates({
					controlActiveState,
					controlDelay: (delayIsFunction ? 0 : delayChildren) + generateStaggerDuration(index),
				});
			}
		);

		return {
			getChildAnimations: () =>
				Promise.all(
					childAnimations.map((animation: () => Promise<any>) => {
						return animation();
					})
				),
		};
	}

	createAnimationFactories(prevTarget: Record<string, any>, animationOptions: $Transition, controlDelay: number) {
		const factories: AnimationFactory[] = [];

		// Build a single VE target of changed keys
		const target: Record<string, any> = {};
		for (const key in this.state.target) {
			if (!hasChanged(prevTarget[key], this.state.target[key])) continue;
			this.state.baseTarget[key] ??= style.get(this.state.element, key) as string;
			target[key] =
				this.state.target[key] === "none" && isDef(transformResetValue[key])
					? transformResetValue[key]
					: this.state.target[key];
		}

		if (Object.keys(target).length) {
			factories.push(
				() =>
					animateVisualElement(
						this.state.visualElement,
						{ ...target, transition: animationOptions as any },
						{ delay: controlDelay }
					) as any
			);
		}

		return factories;
	}

	resolveStateAnimation({
		controlActiveState,
		directAnimate,
		directTransition,
	}: {
		controlActiveState: Partial<Record<string, boolean>> | undefined;
		directAnimate: Options["animate"];
		directTransition: Options["transition"] | undefined;
	}) {
		let variantTransition = this.state.options.transition;
		let variant: VariantType = {};
		const { variants, custom, transition, animatePresenceContext } = this.state.options;
		// THIS IS A DEVIATION FROM THE VUE VERSION, according to cursor:
		// Prefer presence context's `custom` over component-level `custom`.
		// Rationale: On navigation, AnimatePresence updates its `custom` value immediately.
		// The outgoing component's `props.custom` can lag by one tick during the first exit
		// after a direction change, leading to a stale value and incorrect initial exit
		// direction. Using the presence-level `custom` guarantees we resolve variants with
		// the latest direction/value on the very first frame of exit and keeps siblings in sync.
		const customValue = animatePresenceContext?.custom ?? custom;

		this.state.activeStates = { ...this.state.activeStates, ...controlActiveState };
		STATE_TYPES.forEach((name) => {
			if (!this.state.activeStates[name] || isAnimationControls(this.state.options[name])) return;

			const definition = this.state.options[name];
			let resolvedVariant = isDef(definition) ? resolveVariant(definition as any, variants, customValue) : undefined;
			// If current node is a variant node, merge the control node's variant
			if (this.state.visualElement.isVariantNode) {
				const controlVariant = resolveVariant(this.state.context[name], variants, customValue);
				resolvedVariant = controlVariant ? Object.assign(controlVariant || {}, resolvedVariant) : variant;
			}
			if (!resolvedVariant) return;
			if (name !== "initial") variantTransition = resolvedVariant.transition || this.state.options.transition || {};
			variant = Object.assign(variant, resolvedVariant);
		});

		if (directAnimate) {
			variant = resolveVariant(directAnimate, variants, customValue);
			variantTransition = variant.transition || directTransition || transition;
		}

		Object.entries(variant).forEach(([key, value]) => {
			if (key === "transition") return;
			this.state.target[key] = value;
		});
		return variantTransition;
	}

	/**
	 * Subscribe any provided AnimationControls to the component's VisualElement
	 */
	mount() {
		const { element } = this.state;
		mountedStates.set(element, this.state);
		if (!visualElementStore.get(element)) {
			this.state.visualElement.mount(element);
			visualElementStore.set(element, this.state.visualElement);
		}
		// Add state reference to visual element
		(this.state.visualElement as any).state = this.state;
		this.updateAnimationControlsSubscription();

		const visualElement = this.state.visualElement;
		const parentVisualElement = visualElement.parent;
		visualElement.enteringChildren = undefined;
		/**
		 * when current element is new entering child and it's controlled by parent,
		 * animate it by delayChildren
		 */
		if (
			this.state.parent?.isMounted() &&
			!visualElement.isControllingVariants &&
			parentVisualElement?.enteringChildren?.has(visualElement)
		) {
			// Prefer parent's resolved transition; if not yet available (mount order), resolve from parent's variants
			const parentOptions = this.state.parent.options;
			const parentCustom = parentOptions.custom ?? parentOptions.animatePresenceContext?.custom;
			const derivedParentVariant = parentOptions.animate
				? resolveVariant(parentOptions.animate as any, parentOptions.variants, parentCustom)
				: undefined;
			const parentTransition = (this.state.parent.finalTransition ||
				derivedParentVariant?.transition ||
				{}) as $Transition;
			const { delayChildren, staggerChildren = 0, staggerDirection = 1 } = parentTransition;
			const delayIsFunction = typeof delayChildren === "function";
			// Choose the correct group of children to calculate index from
			const group = parentVisualElement.variantChildren?.size
				? parentVisualElement.variantChildren
				: parentVisualElement.enteringChildren?.size
					? parentVisualElement.enteringChildren
					: parentVisualElement.children;
			const controlDelay =
				(delayIsFunction ? 0 : (delayChildren as number) || 0) +
				calcChildStagger(group, visualElement, delayChildren as any, staggerChildren, staggerDirection);
			(
				this.animateUpdates({
					controlActiveState: this.state.parent.activeStates,
					controlDelay,
				}) as Function
			)();
		}
	}

	update() {
		const { animate } = this.state.options;
		const { animate: prevAnimate } = this.state.visualElement.prevProps || {};
		if (animate !== prevAnimate) {
			this.updateAnimationControlsSubscription();
		}
	}

	unmount() {
		this.unmountControls?.();
	}
}
