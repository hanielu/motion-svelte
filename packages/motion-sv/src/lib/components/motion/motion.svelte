<script lang="ts" module>
	/**
	 * Set of void HTML tag names that cannot contain children.
	 *
	 * These tags are treated specially by motion components to prevent
	 * rendering `children` content and to avoid hydration edge cases.
	 *
	 * Source: HTML Living Standard — list of void elements.
	 * @see https://html.spec.whatwg.org/multipage/syntax.html#void-elements
	 */
	const VOID_TAGS = new Set<string>([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr",
	]);
</script>

<script lang="ts">
	import type { MotionProps } from "./types.js";
	import type { FeatureBundle } from "#lib/features/dom-animation.js";
	import type { createVisualElement } from "#lib/state/create-visual-element.js";
	import { AnimatePresenceContext } from "../animate-presence/presence.svelte.js";
	import { LayoutGroupContext, MotionStateContext } from "../context.js";
	import { LayoutMotionScopeContext } from "./layout-motion.svelte";
	import { LazyMotionContext } from "../lazy-motion/context.js";
	import { MotionState } from "#lib/state/motion-state.js";
	import { PresenceManagerContext } from "../animate-presence/index.js";
	import { createSVGStyles, createStyles } from "#lib/state/style.js";
	import { createAttachmentKey } from "svelte/attachments";
	import { css, watch } from "#lib/vendor/runed/index.js";
	import { invariant, warning } from "hey-listen";
	import { isMotionValue } from "framer-motion/dom";
	import { isValidMotionProp } from "./valid-prop.js";
	import { resolveVariantValue } from "#lib/state/utils.js";
	import { resolveMotionProps } from "#lib/utils/resolve-motion-props.js";
	import { updateLazyFeatures } from "#lib/features/lazy-features.js";
	import { untrack, type Component } from "svelte";
	import { useMotionConfig } from "../motion-config/index.js";

	interface MotionComponentProps {
		renderer?: typeof createVisualElement;
		as: string | Component;
		forwardMotionProps?: boolean;
		props: MotionProps;
		ref: HTMLElement | SVGElement | null;
	}

	let {
		renderer,
		as: AsComponent,
		props,
		ref: externalRef = $bindable(),
		forwardMotionProps = false,
	}: MotionComponentProps = $props();

	// motion context
	const parentState = MotionStateContext.getOr(null);
	// layout group context
	const layoutGroup = LayoutGroupContext.getOr({});
	// motion config context
	const config = useMotionConfig();
	// animate presence context
	const presenceContext = AnimatePresenceContext.getOr({});
	const presenceManager = PresenceManagerContext.getOr({});
	// lazy motion context
	const lazyMotionContext = LazyMotionContext.getOr({
		features: () => ({}) as Partial<FeatureBundle>,
		strict: false,
	});
	// layout motion scope context
	const layoutMotionScope = LayoutMotionScopeContext.getOr(null);

	/**
	 * If we're in development mode, check to make sure we're not rendering a motion component
	 * as a child of LazyMotion, as this will break the file-size benefits of using it.
	 */
	// svelte-ignore state_referenced_locally - a one-time mount check; `renderer` is fixed per motion component
	if (process.env.NODE_ENV !== "production" && renderer && lazyMotionContext.strict) {
		const strictMessage =
			"You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
		props.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}

	const motionOptions = $derived(
		resolveMotionProps(props, {
			layoutGroup,
			presenceContext,
			config: config(),
		})
	);

	// svelte-ignore state_referenced_locally - mountOptions is meant to be referenced once per component
	// then updated in the update watcher
	const motionState = new MotionState(motionOptions, parentState!);
	MotionStateContext.set(motionState);
	layoutMotionScope?.register(motionState);

	// If renderer is provided directly (motion component), use it immediately
	// svelte-ignore state_referenced_locally - `renderer` is fixed per motion component
	if (renderer) {
		motionState.initVisualElement(renderer);
		motionState.updateFeatures();
	}

	// Watch for lazy-loaded features (for m component with LazyMotion)
	watch.pre(
		() => lazyMotionContext.features(),
		(bundle) => {
			if (bundle.features?.length) {
				updateLazyFeatures(bundle.features);
			}
			if (bundle.renderer) {
				motionState.initVisualElement(bundle.renderer);
			}
			motionState.updateFeatures();
		}
	);

	const getAttrs = $derived.by(() => {
		const isSVG = motionState.type === "svg";
		const attrsProps: Record<string | symbol, any> = {};

		// 1) Start from DOM-facing attributes, unwrap MotionValues
		for (const key of Reflect.ownKeys(props)) {
			if (typeof key === "string") {
				if (isValidMotionProp(key)) continue;
				const value = props[key];
				attrsProps[key] = isMotionValue(value) ? value.get() : value;
			} else {
				attrsProps[key] = props[key];
			}
		}

		// 2) Build styleProps
		const currentValues = motionState.visualElement?.latestValues || motionState.latestValues;
		let styleSource = isSVG ? {} : currentValues;

		// Opt-in workaround for Chrome IntersectionObserver issue.
		// Chrome's IntersectionObserver correctly computes intersection based on the visible/painted
		// area rather than the layout box. Elements with CSS properties that make them visually
		// invisible (e.g., `clipPath: inset(0% 100% 0% 0%)`) won't trigger `whileInView` because
		// Chrome reports `isIntersecting: false`. When enabled via `inViewOptions.useClipPathWorkaround`,
		// we exclude such properties from inline styles until the animation triggers.
		// @see https://github.com/hanielu/motion-svelte/issues/9
		if (props.whileInView && props.inViewOptions?.useClipPathWorkaround && !motionState.isActive("whileInView")) {
			const filtered: Record<string, any> = {};
			for (const key in styleSource) {
				// Skip clipPath if it would fully clip the element (any inset with 100%)
				if (key === "clipPath") {
					const value = styleSource[key];
					if (typeof value === "string" && value.includes("100%")) {
						continue;
					}
				}
				filtered[key] = styleSource[key];
			}
			styleSource = filtered;
		}

		let styleProps: Record<string, any> = {
			...props.style,
			...styleSource,
		};

		// Extract MotionValue objects to their current values
		// (buildSVGAttrs/buildHTMLStyles expect plain values)
		for (const key in styleProps) {
			if (isMotionValue(styleProps[key])) styleProps[key] = styleProps[key].get();
		}

		// Wait-mode gating: hide new entrants until all exits complete
		const isWaitBlocked = presenceManager.isWaitBlocked?.() === true;
		if (isWaitBlocked && !motionState.isActive("exit")) {
			styleProps.display = "none";
			// Remember that this element's enter was gated so it replays on gate open
			motionState.enterWasGated = true;
		}

		// 3) SVG conversion
		if (isSVG) {
			const { attrs: svgAttrs, style: svgStyle } = createSVGStyles(
				{ ...currentValues, ...styleProps },
				motionState.options.as as string,
				props.style as Record<string, any>
			);
			Object.assign(attrsProps, svgAttrs);
			styleProps = svgStyle;
		}

		// 4) Drag safety styles
		if (props.drag && props.dragListener !== false) {
			Object.assign(styleProps, {
				userSelect: "none",
				WebkitUserSelect: "none",
				WebkitTouchCallout: "none",
				touchAction: props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`,
			});
		}

		// 5) Final style object
		const style = createStyles(styleProps);
		if (style) attrsProps.style = css(style);

		return attrsProps;
	});

	// Resolve exit variant (including its transition) to size the Svelte out transition
	const exitDefinition = $derived.by(() => {
		const customValue = props.custom ?? presenceContext.custom;
		return resolveVariantValue(props.exit, props.variants, customValue);
	});

	// onBeforeUnmount
	$effect.pre(() => {
		return () => {
			layoutMotionScope?.unregister(motionState);
			motionState.beforeUnmount();
		};
	});

	// For layout-only elements in presence context, subscribe to exit start notifications.
	// This ensures the layout animation runs in parallel with exit animations, not after they complete.
	$effect(() => {
		if (!props.layoutId || props.exit || !isInPresenceContext) return;

		const unsubscribe = presenceManager.subscribeToExitStart?.((exitingEl) => {
			// Skip if we're a descendant of the exiting element - we'll fade out naturally with our parent
			if (motionState.element && exitingEl.contains(motionState.element)) {
				return;
			}

			// Trigger layout animation immediately when a blocking exit starts
			motionState.unmount();
			if (motionState.element) {
				motionState.element.style.visibility = "hidden";
			}
		});

		return () => unsubscribe?.();
	});

	// onBeforeUpdate (not really, svelte doesn't have a beforeUpdate hook)
	// so it doesn't work for layout updates like the vue version
	// instead we use the createLayoutMotion().update() method
	//
	// onUpdated
	// now technically, a watch.pre would be more accurate to vue's onUpdated,
	// but I noticed something odd when i tried it:
	// for the basic layout toggle example, it would not work as expected.
	// More specifically, if the first button's handle had a `layoutDependency` prop,
	// e.g. `<layout.div layoutDependency={isOn} />`,
	// then each subsequent button's handle with a `layoutId` prop would not work as expected.
	// they'd kinda flicker when toggling (I guess going from opacity 0->1?)
	// unless I set `crossfade={false}` on the handle(s) with the `layoutId` prop.
	// so we're using a watch instead.
	//
	// Not lazy: options can change between the state's creation and this watch's first run
	// (e.g. an element bound by a parent attachment and passed as dragConstraints), and a lazy
	// first run would swallow that change.
	watch(
		() => motionOptions,
		(options) => {
			if (options === motionState.options) return;
			motionState.updateOptions(options);
			motionState.update();
		}
	);

	// In wait mode, entering nodes must not adopt their animate styles until all
	// blocking exits complete. The gate is checked lazily (at the deferred initial
	// animateChanges) because when a keyed block switches, the entering element can
	// mount *before* the outgoing element's outro starts raising the gate.
	if (presenceManager.isWaitBlocked) {
		motionState.isEnterBlocked = () =>
			untrack(() => presenceManager.isWaitBlocked!() === true && !motionState.isActive("exit"));
	}

	// onMounted (attachment)
	function nodeRef(node: HTMLElement | SVGElement) {
		externalRef = node;

		motionState.mount(node);

		// onUnmounted
		return () => {
			motionState.unmount();
		};
	}

	let wasWaitBlocked = presenceManager.isWaitBlocked?.() === true;

	$effect.pre(() => {
		const blocked = presenceManager.isWaitBlocked?.() === true;
		if (wasWaitBlocked && !blocked && motionState.enterWasGated && !motionState.isActive("exit")) {
			// Gate opened: replay the enter animation from initial values. The mount
			// animation may have already run while the element was hidden (the gate
			// can rise after this element's deferred mount pass), so a plain
			// setActive("animate", true) would no-op.
			motionState.enterWasGated = false;
			motionState.enterFromInitial();
		}
		wasWaitBlocked = blocked;
	});

	// Just here to make sure the behavior is consistent with the vue version, just in case
	const isInPresenceContext = AnimatePresenceContext.exists();

	// For popLayout mode, track element position continuously.
	// This ensures we always have the correct position cached when the element
	// starts exiting, even if the DOM shifts due to other elements being added.
	$effect(() => {
		if (!props.exit || !isInPresenceContext) return;
		// Start tracking this element's position
		presenceManager.trackPosition?.(motionState);

		return () => {
			// Stop tracking when element unmounts or exits
			presenceManager.untrackPosition?.(motionState);
		};
	});

	// We pass this in only when we're in a presence context,
	// this way users not using presence don't need to deal with the added bundle size.
	const motionExitTransition = presenceContext.transition;
	const shouldAllowExit = () => !!props.exit && isInPresenceContext && !presenceContext.isUnmounting;

	/**
	 * Svelte transitions only keep the DOM node alive while MotionState plays the exit; motion drives the actual
	 * animations. Exits and entries use separate `out:`/`in:` directives so the exit always knows it is one (a
	 * bidirectional `transition:` gets `direction: "both"`). Entering needs no hold: `motionEnter` only exists so
	 * `introstart` fires, e.g. when an exiting element comes back.
	 */
	function motionExit(node: Element) {
		if (!shouldAllowExit()) return null;
		return motionExitTransition(node, { definition: exitDefinition, state: motionState });
	}
	const motionEnter = (_node: Element) => ({});

	const onintrostart = () => shouldAllowExit() && presenceManager.onIntroStart?.(motionState.element!);
	const onoutrostart = () => shouldAllowExit() && presenceManager.onOutroStart?.(motionState.element!);
	const onoutroend = () => shouldAllowExit() && presenceManager.onOutroEnd?.(motionState.element!);

	const key = createAttachmentKey();
	const sharedProps = $derived({
		...getAttrs,
		[key]: nodeRef,
		onintrostart,
		onoutrostart,
		onoutroend,
	});
</script>

{#if typeof AsComponent === "string"}
	{#if VOID_TAGS.has(AsComponent)}
		<svelte:element this={AsComponent} {...sharedProps} in:motionEnter|global out:motionExit|global />
	{:else}
		<svelte:element
			this={AsComponent}
			{...sharedProps}
			xmlns={motionState.type === "svg" ? "http://www.w3.org/2000/svg" : undefined}
			in:motionEnter|global
			out:motionExit|global
		>
			{@render props.children?.()}
		</svelte:element>
	{/if}
{:else}
	<AsComponent {...sharedProps} />
{/if}
