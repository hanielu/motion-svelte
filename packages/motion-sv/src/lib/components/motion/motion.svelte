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
	import type { DOMKeyframesDefinition } from "framer-motion";
	import type { Feature } from "@/features/feature.js";
	import type { MotionProps } from "./types.js";
	import { AnimatePresenceContext } from "../animate-presence/presence.svelte.js";
	import { LayoutGroupContext, MotionStateContext } from "../context.js";
	import { LayoutMotionScopeContext } from "./layout-motion.svelte";
	import { LazyMotionContext } from "../lazy-motion/context.js";
	import { MotionState } from "@/state/motion-state.js";
	import { PresenceManagerContext } from "../animate-presence/index.js";
	import { convertSvgStyleToAttributes, createStyles } from "@/state/style.js";
	import { createAttachmentKey } from "svelte/attachments";
	import { css, watch } from "runed";
	import { invariant, warning } from "hey-listen";
	import { isMotionValue } from "framer-motion/dom";
	import { isValidMotionProp } from "./valid-prop.js";
	import { resolveVariant } from "@/state/utils.js";
	import { untrack, type Component } from "svelte";
	import { useMotionConfig } from "../motion-config/index.js";

	type MaybePromise<T> = T | Promise<T> | (() => Promise<T>);

	interface MotionComponentProps {
		features?: MaybePromise<Feature[]>;
		as: string | Component;
		forwardMotionProps?: boolean;
		props: MotionProps;
		ref: HTMLElement | SVGElement | null;
	}

	let {
		features = [],
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
	const animatePresenceContext = AnimatePresenceContext.getOr({});
	const presenceManager = PresenceManagerContext.getOr({});
	// lazy motion context
	const lazyMotionContext = LazyMotionContext.getOr({
		features: () => [],
		strict: false,
	});
	// layout motion scope context
	const layoutMotionScope = LayoutMotionScopeContext.getOr(null);

	/**
	 * If we're in development mode, check to make sure we're not rendering a motion component
	 * as a child of LazyMotion, as this will break the file-size benefits of using it.
	 */
	if (
		process.env.NODE_ENV !== "production" &&
		// @ts-expect-error
		features?.length &&
		lazyMotionContext.strict
	) {
		const strictMessage =
			"You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
		props.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}

	/**
	 * Get the layout ID for the motion component
	 * If both layoutGroup.id and props.layoutId exist, combine them with a hyphen
	 * Otherwise return props.layoutId or undefined
	 */
	function getLayoutId() {
		if (layoutGroup.id && props.layoutId) return `${layoutGroup.id}-${props.layoutId}`;
		return props.layoutId || undefined;
	}

	const motionOptions = $derived({
		...props,
		features,
		lazyMotionContext,
		layoutId: getLayoutId(),
		transition: props.transition ?? config().transition,
		layoutGroup,
		motionConfig: config(),
		inViewOptions: props.inViewOptions ?? config().inViewOptions,
		animatePresenceContext,
		initial:
			animatePresenceContext.initial === false
				? animatePresenceContext.initial
				: props.initial === true
					? undefined
					: props.initial,
	});

	// svelte-ignore state_referenced_locally - mountOptions is meant to be referenced once per component
	// then updated in onUpdated (which is $effect.pre)
	const motionState = new MotionState(motionOptions, parentState!);
	MotionStateContext.set(motionState);
	layoutMotionScope?.register(motionState);

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
		let styleProps: Record<string, any> = {
			...props.style,
			...(isSVG ? {} : motionState.visualElement?.latestValues || motionState.baseTarget),
		};

		// Wait-mode gating: hide new entrants until all exits complete
		const isWaitBlocked = presenceManager.isWaitBlocked?.() === true;
		if (isWaitBlocked && !motionState.activeStates.exit) {
			styleProps.display = "none";
		}

		// 3) SVG conversion
		if (isSVG) {
			const { attrs, style } = convertSvgStyleToAttributes({
				...(motionState.isMounted() ? motionState.target : motionState.baseTarget),
				...styleProps,
			} as DOMKeyframesDefinition);

			if (style.transform || attrs.transformOrigin) {
				style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
				delete attrs.transformOrigin;
			}
			if (style.transform) {
				style.transformBox = style.transformBox ?? "fill-box";
				delete attrs.transformBox;
			}

			Object.assign(attrsProps, attrs);
			styleProps = style as Record<string, any>;
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

	// Resolve exit variant to use as a Svelte out transition
	const exitDefinition = $derived.by(() => {
		const customValue = props.custom ?? animatePresenceContext.custom;
		return resolveVariant(props.exit, props.variants, customValue);
	});

	// onBeforeMount
	$effect.pre(() => {
		motionState.beforeMount();

		// onBeforeUnmount
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
	// $effect.pre(() => {
	// 	void motionOptions; // trigger effect
	// 	state.beforeUpdate();
	// });

	// onUpdated
	// now technically, a watch.pre would be more accurate to vue's onUpdated,
	// but I noticed something odd when i tried it:
	// for the basic layout toggle example, it would not work as expected.
	// More specifically, if the first button's handle had a `layoutDependency` prop,
	// e.g. `<layout.div layoutDependency={isOn} />`,
	// then each subsequent button's handle with a `layoutId` prop would not work as expected.
	// they'd kinda flicker when toggling (I guess going from opacity 0->1?)
	// unless I set `crossfade={false}` on the handle(s) with the `layoutId` prop.
	// Nothing I tried would fix it. (setting `layoutRoot` on the button, or using `LayoutGroup` or both)
	// so we're using a watch instead.
	//
	// This bug(?) exists in vue too, so this is kinda an advantage the svelte version has over the vue version.
	//
	// TBD if we'll run into other issues with this.
	watch(
		() => motionOptions,
		(options) => {
			motionState.update(options);
		},
		{ lazy: true }
	);

	// onMounted (attachment)
	function nodeRef(node: HTMLElement | SVGElement) {
		externalRef = node;

		const waitBlocked = untrack(() => presenceManager.isWaitBlocked?.() === true);
		motionState.mount(
			node,
			untrack(() => motionOptions),
			/* notAnimate when wait-blocked */ waitBlocked
		);

		// In wait mode, prevent the entering node from immediately adopting its animate styles.
		// We temporarily disable the animate state so VE updates (while blocked) maintain initial values.
		if (waitBlocked) {
			motionState.setActive("animate", false, false);
		}

		// onUnmounted
		return () => {
			motionState.unmount();
		};
	}

	/**
	 * Controls whether Svelte's built-in intro transition plays on first mount.
	 *
	 * When false:
	 * - Allows MotionState to handle the initial mount animation
	 * - If an exit prop is present, enables the exit animation to play
	 * - Supports interrupting and reversing animations from their current state
	 *
	 * This approach provides better animation control and interruptibility compared to
	 * using Svelte's native transitions alone.
	 */
	let allowIntro = false;
	let wasWaitBlocked = presenceManager.isWaitBlocked?.() === true;

	$effect.pre(() => {
		const blocked = presenceManager.isWaitBlocked?.() === true;
		if (wasWaitBlocked && !blocked) {
			// Gate opened: re-enable animate state and trigger enter from current base/initial
			motionState.setActive("animate", true, false);
			motionState.startAnimation();
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
	const motionExitTransition = animatePresenceContext.transition;
	const shouldAllowExit = () => !!props.exit && isInPresenceContext;

	function motionExit(node: Element) {
		if (!shouldAllowExit()) return null;
		return motionExitTransition(node, {
			definition: exitDefinition,
			state: motionState,
			allowIntro,
			setAllowIntro: (v) => (allowIntro = v),
		});
	}

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
		<svelte:element this={AsComponent} {...sharedProps} transition:motionExit|global />
	{:else}
		<svelte:element
			this={AsComponent}
			{...sharedProps}
			xmlns={motionState.type === "svg" ? "http://www.w3.org/2000/svg" : undefined}
			transition:motionExit|global
		>
			{@render props.children?.()}
		</svelte:element>
	{/if}
{:else}
	<AsComponent {...sharedProps} />
{/if}
