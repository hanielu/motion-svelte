import { LazyContext } from "$lib/context/lazy-context.js";
import { MotionConfigContext } from "$lib/context/motion-config-context.js";
import { MotionContext } from "$lib/context/motion-context/index.js";
import { PresenceContext } from "$lib/context/presence-context.js";
import { SwitchLayoutGroupContext, type InitialPromotionConfig } from "$lib/context/switch-layout-group-context.js";
import type { IProjectionNode } from "$lib/projection/node/types.js";
import type { DOMMotionComponents } from "$lib/render/dom/types.js";
import type { HTMLRenderState } from "$lib/render/html/types.js";
import type { SVGRenderState } from "$lib/render/svg/types.js";
import type { CreateVisualElement } from "$lib/render/types.js";
import type { VisualElement } from "$lib/render/VisualElement.js";
import type { MotionProps } from "../types.js";
import type { VisualState } from "./use-visual-state.js";
import type { Component } from "svelte";
import { optimizedAppearDataAttribute } from "$lib/animation/optimized-appear/data-id.js";
import type { ReadableBox } from "runed";

export function useVisualElement<Props extends Record<string, any>, TagName extends keyof DOMMotionComponents | string>(
	Component: TagName | string | Component<Props>,
	visualState: VisualState<SVGElement, SVGRenderState> | VisualState<HTMLElement, HTMLRenderState>,
	props: ReadableBox<MotionProps & Partial<MotionConfigContext>>,
	createVisualElement?: CreateVisualElement<Props, TagName>,
	ProjectionNodeConstructor?: () => any | undefined
) {
	//: VisualElement<HTMLElement | SVGElement> | undefined

	// TODO: (haniel) if something breaks maybe we need to be deriving state in here

	const parent = MotionContext.getOr().visualElement;
	const lazyContext = LazyContext.getOr();
	const presenceContext = PresenceContext.getOr();
	const reducedMotionConfig = MotionConfigContext.current.reducedMotion;

	/**
	 * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	 */
	createVisualElement = createVisualElement || (lazyContext.renderer as unknown as CreateVisualElement<Props, TagName>);

	const visualElement = createVisualElement
		? createVisualElement(Component, {
				visualState: visualState as any,
				parent,
				props: props.current,
				presenceContext,
				blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
				reducedMotionConfig,
			})
		: null;

	const initialLayoutGroupConfig = SwitchLayoutGroupContext.current;

	$effect.pre(() => {
		const projectionNodeConstructor = ProjectionNodeConstructor?.();

		if (
			visualElement &&
			!visualElement.projection &&
			projectionNodeConstructor &&
			(visualElement.type === "html" || visualElement.type === "svg")
		) {
			createProjectionNode(visualElement, props.current, projectionNodeConstructor, initialLayoutGroupConfig);
		}
	});

	let isMounted = $state(false);

	$effect.pre(() => {
		/**
		 * Check the component has already mounted before calling
		 * `update` unnecessarily. This ensures we skip the initial update.
		 */
		if (visualElement && isMounted) {
			// console.log("[haniel] update", props.current);
			visualElement.update(props.current, presenceContext);
		}
	});

	/**
	 * Cache this value as we want to know whether HandoffAppearAnimations
	 * was present on initial render - it will be deleted after this.
	 */
	const optimisedAppearId = props.current[optimizedAppearDataAttribute as keyof typeof props.current];
	let wantsHandoff =
		Boolean(optimisedAppearId) &&
		!window.MotionHandoffIsComplete?.(optimisedAppearId) &&
		window.MotionHasOptimisedAnimation?.(optimisedAppearId);

	$effect(() => {
		if (!visualElement) return;

		isMounted = true;
		window.MotionIsMounted = true;

		// console.log("[haniel] updateFeatures");
		visualElement.updateFeatures();
		visualElement.scheduleRenderMicrotask();

		/**
		 * Ideally this function would always run in a useEffect.
		 *
		 * However, if we have optimised appear animations to handoff from,
		 * it needs to happen synchronously to ensure there's no flash of
		 * incorrect styles in the event of a hydration error.
		 *
		 * So if we detect a situtation where optimised appear animations
		 * are running, we use useLayoutEffect to trigger animations.
		 */
		if (wantsHandoff && visualElement.animationState) {
			visualElement.animationState.animateChanges();
		}
	});

	$effect(() => {
		if (!visualElement) return;

		void props.current;

		if (!wantsHandoff && visualElement.animationState) {
			visualElement.animationState.animateChanges();
		}

		if (wantsHandoff) {
			// This ensures all future calls to animateChanges() in this component will run in useEffect
			queueMicrotask(() => {
				window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
			});

			wantsHandoff = false;
		}

		/**
		 * Now we've finished triggering animations for this element we
		 * can wipe the enteringChildren set for the next render.
		 */
		visualElement.enteringChildren = undefined;
	});

	return visualElement!;
}

function createProjectionNode(
	visualElement: VisualElement<any>,
	props: MotionProps,
	ProjectionNodeConstructor: any,
	initialPromotionConfig?: InitialPromotionConfig
) {
	const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot, layoutCrossfade } = props;

	visualElement.projection = new ProjectionNodeConstructor(
		visualElement.latestValues,
		props["data-framer-portal-id"] ? undefined : getClosestProjectingNode(visualElement.parent)
	) as IProjectionNode;

	visualElement.projection.setOptions({
		layoutId,
		layout,
		alwaysMeasureLayout: needsContinuousMeasurement(drag, dragConstraints),
		visualElement,
		/**
		 * TODO: Update options in an effect. This could be tricky as it'll be too late
		 * to update by the time layout animations run.
		 * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
		 * ensuring it gets called if there's no potential layout animations.
		 *
		 */
		animationType: typeof layout === "string" ? layout : "both",
		initialPromotionConfig,
		crossfade: layoutCrossfade,
		layoutScroll,
		layoutRoot,
	});
}

function getClosestProjectingNode(
	visualElement?: VisualElement<unknown, unknown, { allowProjection?: boolean }>
): IProjectionNode | undefined {
	if (!visualElement) return undefined;

	return visualElement.options.allowProjection !== false
		? visualElement.projection
		: getClosestProjectingNode(visualElement.parent);
}

function needsContinuousMeasurement(drag: MotionProps["drag"], dragConstraints: MotionProps["dragConstraints"]) {
	if (!dragConstraints) return Boolean(drag);

	// Direct element reference
	if (dragConstraints instanceof HTMLElement) return true;

	// Check if it's a static constraint object
	if (
		typeof dragConstraints === "object" &&
		("left" in dragConstraints || "right" in dragConstraints || "top" in dragConstraints || "bottom" in dragConstraints)
	) {
		return Boolean(drag); // Static constraints don't need continuous measurement
	}

	return Boolean(drag);
}
