import type { MotionStateContext, Options } from "#lib/types/index.js";
import { invariant } from "hey-listen";
import type { AnimationType, DOMKeyframesDefinition, VisualElement, VisualElementOptions } from "motion-dom";
import { frame, isVariantLabel } from "motion-dom";
import { isSVGElement, resolveInitialValues } from "#lib/state/utils.js";
import type { Feature, FeatureKey } from "#lib/features/feature.js";
import type { StateType } from "#lib/features/animation/animation.js";
import { lazyFeatures } from "#lib/features/lazy-features.js";
import type { PresenceContext } from "#lib/components/animate-presence/presence.svelte.js";
import { motionGlobalConfig } from "#lib/config.js";

// Map to track mounted motion states by element
export const mountedStates = new WeakMap<Element, MotionState>();

// motion-dom's animation state keys use 'whileTap'; our public prop is 'whilePress'
const toAnimationType = (name: StateType) => (name === "whilePress" ? "whileTap" : name) as AnimationType;

/**
 * Core class that manages animation state and orchestrates animations.
 * Handles component lifecycle methods in the correct order based on component tree position.
 */
export class MotionState {
	public type: "html" | "svg";
	public element: HTMLElement | SVGElement | null = null;
	// Parent reference for handling component tree relationships
	public parent?: MotionState;

	// Whether the element is exiting
	public isExiting = false;
	// The AnimatePresence container this motion component belongs to
	public presenceContainer: HTMLElement | null = null;
	/**
	 * Svelte-specific: set by the Motion component when inside an AnimatePresence
	 * wait-mode gate. While it returns true, the entering element holds its
	 * initial values instead of running its mount animation.
	 */
	public isEnterBlocked?: () => boolean;
	/**
	 * Svelte-specific: marked when this element was hidden by the wait-mode gate,
	 * so the enter animation is replayed once the gate opens.
	 */
	public enterWasGated = false;
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

	// Visual element instance from Framer Motion
	public visualElement: VisualElement<Element>;

	constructor(options: Options, parent?: MotionState) {
		this.options = options;
		this.parent = parent;
		// Add to parent's children set for lifecycle management
		parent?.children?.add(this);

		this.latestValues = resolveInitialValues(options, this.context);
		this.type = isSVGElement(this.options.as as any) ? "svg" : "html";
	}

	private _context: MotionStateContext | null = null;

	// Get animation context, falling back to parent context for inheritance
	get context() {
		if (!this._context) {
			const handler = {
				get: (target: MotionStateContext, prop: keyof MotionStateContext) => {
					const value = this.options[prop];
					if (isVariantLabel(value) || (prop === "initial" && value === false)) {
						return value;
					}
					return this.parent?.context[prop];
				},
			};

			this._context = new Proxy({} as MotionStateContext, handler);
		}
		return this._context;
	}

	/**
	 * Initialize features from options and global lazy features
	 * Features are stored by key to avoid duplicate instantiation
	 */
	updateFeatures() {
		if (!this.visualElement) return;
		for (const FeatureCtor of lazyFeatures) {
			if (!this.features.has(FeatureCtor.key)) {
				this.features.set(FeatureCtor.key, new FeatureCtor(this));
			}
			const feature = this.features.get(FeatureCtor.key);
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
	updateOptions(options: Options) {
		this.options = options;
		this.visualElement?.update(
			{
				...(this.options as any),
				whileTap: this.options.whilePress,
			},
			// presenceContext shape differs from motion-dom's PresenceContextProps
			(this.options.presenceContext ?? null) as any
		);
	}

	// Mount motion state to DOM element, handles parent-child relationships
	mount(element: HTMLElement | SVGElement) {
		invariant(Boolean(element), "Animation state must be mounted with valid Element");
		mountedStates.set(element, this);
		this.element = element;
		const presenceId = this.options.presenceContext?.presenceId;
		if (presenceId !== undefined) {
			element.setAttribute(motionGlobalConfig.motionAttribute, presenceId);
		}
		this.features.get("projection")?.update();
		this.visualElement?.mount(element);
		this.updateFeatures();
	}

	// Called before unmounting, executes in child-to-parent order
	beforeUnmount() {
		this.getSnapshot(this.options, false);
	}

	unmount() {
		this.parent?.children?.delete(this);
		mountedStates.delete(this.element);
		this.features.forEach((f) => f.unmount?.());

		const projection = this.visualElement?.projection;
		const shouldDeferProjectionUnmount = Boolean(this.options.layoutId && projection);

		if (shouldDeferProjectionUnmount) {
			this.visualElement.projection = undefined;
		}

		this.visualElement?.unmount();

		if (shouldDeferProjectionUnmount && projection) {
			this.visualElement.projection = projection;
			frame.postRender(() => projection.unmount());
		}
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

	tryExitComplete() {
		if (this.isExiting) return;
		if (this.options?.layoutId && this.visualElement.projection?.currentAnimation?.state === "running") {
			return;
		}
		this.options.presenceContext?.onMotionExitComplete?.(this.presenceContainer, this);
	}

	// Set animation state active status and propagate to children
	setActive(name: StateType, isActive: boolean) {
		if (name === "exit" && isActive) {
			this.isExiting = true;
		}
		this.visualElement?.animationState?.setActive(toAnimationType(name), isActive).then(() => {
			if (name === "exit" && isActive) {
				this.isExiting = false;
				this.options?.layoutId ? frame.postRender(() => this.tryExitComplete()) : this.tryExitComplete();
			}
		});
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
		for (const key in this.latestValues) {
			const initial = (this.latestValues as any)[key];
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
	initVisualElement(renderer: (tag: string, options: VisualElementOptions<any, any>) => VisualElement<Element>) {
		if (this.visualElement) return;
		this.visualElement = renderer(this.options.as as string, {
			// @ts-expect-error - presenceContext shape differs from motion-dom's
			presenceContext: this.options.presenceContext ?? null,
			parent: this.parent?.visualElement,
			props: { ...this.options, whileTap: this.options.whilePress } as any,
			visualState: {
				renderState: {
					transform: {},
					transformOrigin: {},
					style: {},
					vars: {},
					attrs: {},
				},
				latestValues: { ...this.latestValues } as any,
			},
			reducedMotionConfig: this.options.motionConfig?.reducedMotion,
		});
		this.visualElement.parent?.addChild(this.visualElement);
		if (this.isMounted()) {
			this.visualElement.mount(this.element);
		}
	}

	getSnapshot(options: Options, isPresent?: boolean) {}
	didUpdate() {}
}
