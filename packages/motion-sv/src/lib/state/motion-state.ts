import type { MotionStateContext, Options } from "#lib/types/index.js";
import { invariant } from "hey-listen";
import type {
	AnimationType,
	DOMKeyframesDefinition,
	MotionNodeOptions,
	PresenceContextProps,
	ResolvedValues,
	VisualElement,
} from "motion-dom";
import { frame, isVariantLabel } from "motion-dom";
import { isSVGElement, resolveInitialValues } from "#lib/state/utils.js";
import type { Feature, FeatureKey } from "#lib/features/feature.js";
import type { StateType } from "#lib/features/animation/animation.js";
import type { FeatureBundle } from "#lib/features/dom-animation.js";
import type { PresenceContext } from "#lib/components/animate-presence/presence.svelte.js";

// Map to track mounted motion states by element
export const mountedStates = new WeakMap<Element, MotionState>();

// motion-dom's animation state keys use 'whileTap'; our public prop is 'whilePress'
const toAnimationType = (name: StateType) => (name === "whilePress" ? "whileTap" : name) as AnimationType;

/** motion-dom reads the same props, except `whilePress`, which it knows as `whileTap`. */
const toVisualElementProps = (options: Options) =>
	({ ...options, whileTap: options.whilePress }) as unknown as MotionNodeOptions;

/** motion-dom only reads the presence context's `initial` and `custom`, which ours has too. */
const toPresenceContextProps = ({ presenceContext }: MotionState["options"]) =>
	(presenceContext ?? null) as unknown as PresenceContextProps | null;

/**
 * Core class that manages animation state and orchestrates animations.
 * Handles component lifecycle methods in the correct order based on component tree position.
 */
export class MotionState {
	public type: "html" | "svg";
	public element: HTMLElement | SVGElement | null = null;
	// Parent reference for handling component tree relationships
	public parent?: MotionState;

	// Whether the exit animation is running
	public isExiting = false;
	/**
	 * Set until the element's first frame. An element mounted in the same update as an exit has never been painted, so
	 * it has no position to animate its layout from (as in React).
	 */
	public isNewlyMounted = false;
	/**
	 * Bumped by exit() and reenter(). An exit completion from an older generation is a no-op, so an
	 * exit → reenter → exit sequence can't have the first exit's late settlement end the second one.
	 */
	private exitGeneration = 0;
	private settlePendingExit?: VoidFunction;
	/**
	 * Svelte-specific: set by the Motion component inside an AnimatePresence in "wait" mode. While it returns true,
	 * the entering element holds its initial values instead of running its mount animation.
	 */
	public isEnterBlocked?: () => boolean;
	public options: Options & {
		presenceContext?: PresenceContext;
		features?: Array<typeof Feature>;
	};

	// Track child components for proper lifecycle ordering
	private children?: Set<MotionState> = new Set();

	// Initial style values, serves as fallback before visualElement exists
	public latestValues: DOMKeyframesDefinition;

	// Feature instances managed by key
	private features = new Map<FeatureKey, Feature>();
	// The features this component can use: its own bundle's, or for `m` components the nearest LazyMotion's
	private featureCtors: ReadonlyArray<typeof Feature> = [];

	// The visual element, created by setBundle() before any feature exists
	public visualElement!: VisualElement<Element>;

	constructor(options: Options, parent?: MotionState) {
		this.options = options;
		this.parent = parent;
		// Add to parent's children set for lifecycle management
		parent?.children?.add(this);

		this.latestValues = resolveInitialValues(options, this.context);
		this.type = isSVGElement(this.options.as ?? "div") ? "svg" : "html";
	}

	/** The variant labels this component's children inherit: its own, or its parent's. */
	get context(): MotionStateContext {
		const { initial, animate } = this.options;
		return {
			initial: isVariantLabel(initial) || initial === false ? initial : this.parent?.context.initial,
			animate: isVariantLabel(animate) ? animate : this.parent?.context.animate,
		};
	}

	/**
	 * Set (or, for LazyMotion, resolve later) the renderer and features of this component, then sync its features.
	 */
	setBundle({ renderer, features }: Partial<FeatureBundle>) {
		if (renderer) this.initVisualElement(renderer);
		if (features?.length) this.featureCtors = features;
		this.updateFeatures();
	}

	/**
	 * Create missing features, then mount unmounted ones and update the rest.
	 * Features are stored by key to avoid duplicate instantiation
	 */
	updateFeatures() {
		if (!this.visualElement) return;
		for (const FeatureCtor of this.featureCtors) {
			let feature = this.features.get(FeatureCtor.key);
			if (!feature) {
				const { enabledBy } = FeatureCtor;
				if (enabledBy && !enabledBy.some((prop) => this.options[prop])) continue;
				feature = new FeatureCtor(this);
				this.features.set(FeatureCtor.key, feature);
			}
			if (this.isMounted()) {
				if (!feature.isMount) {
					feature.mount();
					feature.isMount = true;
				} else {
					feature.update();
				}
			}
		}
	}

	// Update visual element with new options
	updateOptions(options: MotionState["options"]) {
		this.options = options;
		this.visualElement?.update(toVisualElementProps(options), toPresenceContextProps(options));
	}

	// Mount motion state to DOM element, handles parent-child relationships
	mount(element: HTMLElement | SVGElement) {
		invariant(Boolean(element), "Animation state must be mounted with valid Element");
		mountedStates.set(element, this);
		this.element = element;
		this.isNewlyMounted = true;
		frame.postRender(() => (this.isNewlyMounted = false));
		this.features.get("projection")?.update();
		if (this.options.layoutId) {
			// A layoutId node snapshots its page box when it mounts. The root's scroll offset is only refreshed during
			// projection updates, so after a client-side navigation it can still hold the previous page's scroll.
			this.refreshRootScroll();
			this.snapshotLeadOf(this.options.layoutId);
		}
		this.visualElement?.mount(element);
		this.updateFeatures();
		// Render once the mount animations have started, as React does, so values they settle without changing (e.g. an
		// SVG `x: "none"`, which resolves to 0) still reach the element.
		this.visualElement?.scheduleRenderMicrotask();
	}

	/**
	 * Mounting the projection makes this element the lead of its layoutId, taking over from the current one. When that
	 * one is still on the page (an element shown alongside it, or Svelte mounting the new branch before removing the
	 * old), measure it first, so this element animates from it.
	 */
	private snapshotLeadOf(layoutId: string) {
		const lead = this.visualElement?.projection?.root?.sharedNodes.get(layoutId)?.lead;
		if (lead?.instance && !lead.snapshot) lead.willUpdate();
	}

	private refreshRootScroll() {
		const root = this.visualElement?.projection?.root;
		if (!root) return;
		root.scroll = undefined;
		root.updateScroll();
	}

	// Called before unmounting, executes in child-to-parent order
	beforeUnmount() {
		this.getSnapshot(this.options, false);
	}

	unmount() {
		this.settleExit();
		this.parent?.children?.delete(this);
		if (this.element) mountedStates.delete(this.element);
		this.features.forEach((feature) => {
			feature.unmount();
			// A later mount() re-mounts it, restoring its listeners
			feature.isMount = false;
		});
		this.visualElement?.unmount();
	}

	// Called before updating, executes in parent-to-child order
	beforeUpdate() {
		this.getSnapshot(this.options, undefined);
	}

	// Update motion state with new options
	update() {
		this.updateFeatures();
		this.didUpdate();
	}

	// Set animation state active status and propagate to children
	setActive(name: StateType, isActive: boolean) {
		return this.visualElement?.animationState?.setActive(toAnimationType(name), isActive);
	}

	/**
	 * Play the AnimatePresence exit. Resolves once it is complete, including the layoutId handoff to the next lead,
	 * which ProjectionFeature reports through completeExitFromProjection().
	 */
	exit(): Promise<void> {
		const generation = ++this.exitGeneration;
		this.isExiting = true;
		const completion = new Promise<void>((resolve) => (this.settlePendingExit = resolve));

		const exitAnimation = this.setActive("exit", true);
		const onAnimationComplete = () => {
			if (generation !== this.exitGeneration) return;
			this.isExiting = false;
			// The layoutId handoff animation starts asynchronously, so check for it once the projection has run.
			this.options.layoutId
				? frame.postRender(() => this.tryCompleteExit(generation))
				: this.tryCompleteExit(generation);
		};
		exitAnimation ? exitAnimation.then(onAnimationComplete) : onAnimationComplete();

		this.getSnapshot(this.options, false);
		return completion;
	}

	/** Come back while an exit is in flight; the abandoned exit settles silently. */
	reenter() {
		this.exitGeneration++;
		this.settleExit();
		this.isExiting = false;
		this.setActive("exit", false);
		this.getSnapshot(this.options, true);
	}

	completeExitFromProjection() {
		this.tryCompleteExit(this.exitGeneration);
	}

	private tryCompleteExit(generation: number) {
		if (generation !== this.exitGeneration || this.isExiting) return;
		// Removing the element mid-handoff would cut the shared layout animation short.
		if (this.options.layoutId && this.visualElement.projection?.currentAnimation?.state === "running") return;
		this.settleExit();
	}

	private settleExit() {
		this.settlePendingExit?.();
		this.settlePendingExit = undefined;
	}

	/**
	 * Svelte-specific: flip an animation type's active flag without triggering animations.
	 * Used by AnimatePresence wait-mode gating, where an entering element must not adopt
	 * its animate styles until blocking exits have finished.
	 */
	setActiveNoAnimate(name: StateType, isActive: boolean) {
		const typeState = this.visualElement?.animationState?.getState()?.[toAnimationType(name)];
		if (typeState) {
			typeState.isActive = isActive;
		}
	}

	/**
	 * Svelte-specific: replay the enter animation from initial values.
	 * Used by AnimatePresence wait-mode when the gate opens. The element was
	 * hidden (display:none) while blocked, and its mount animation may have
	 * already started or completed underneath — so we jump back to the resolved
	 * initial values, reset the animation state, and run a fresh pass.
	 */
	enterFromInitial() {
		const ve = this.visualElement;
		if (!ve) return;
		ve.values.forEach((value) => value.stop());
		for (const [key, initial] of Object.entries(this.latestValues as ResolvedValues)) {
			if (initial === undefined) continue;
			ve.getValue(key)?.jump(initial);
			ve.latestValues[key] = initial;
		}
		ve.animationState?.reset();
		ve.animationState?.animateChanges();
	}

	/**
	 * Svelte-specific: read whether an animation type is currently active.
	 * Replaces the old `activeStates` record.
	 */
	isActive(name: StateType) {
		return Boolean(this.visualElement?.animationState?.getState()?.[toAnimationType(name)]?.isActive);
	}

	isMounted() {
		return Boolean(this.element);
	}

	/**
	 * Create and attach a visual element using the given renderer.
	 */
	private initVisualElement(renderer: FeatureBundle["renderer"]) {
		if (this.visualElement) return;
		this.visualElement = renderer(this.options.as as string, {
			presenceContext: toPresenceContextProps(this.options),
			parent: this.parent?.visualElement,
			props: toVisualElementProps(this.options),
			visualState: {
				renderState: {
					transform: {},
					transformOrigin: {},
					style: {},
					vars: {},
					attrs: {},
				},
				latestValues: { ...this.latestValues } as ResolvedValues,
			},
			reducedMotionConfig: this.options.motionConfig?.reducedMotion,
		});
		// No parent.addChild() here: visualElement.mount() registers with the parent once `current` is set, so
		// enteringChildren never holds unmounted children (stagger sorting crashes on them in Firefox).
		if (this.element) {
			// Features loaded after mount (async LazyMotion): animate from initial so changes made meanwhile still run.
			this.visualElement.manuallyAnimateOnMount = true;
			this.visualElement.mount(this.element);
		}
	}

	getSnapshot(options: Options, isPresent?: boolean) {}
	didUpdate() {}
}
