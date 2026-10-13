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

	/** The motion component's own props, which never reach the element. */
	const OWN_PROPS = new Set(["as", "ref", "forwardMotionProps"]);

	/** The longest Svelte keeps an exiting element if its exit never reports completion. */
	const EXIT_HOLD_LIMIT = 10_000;
</script>

<script lang="ts">
	import type { MotionProps } from "./types.js";
	import type { FeatureBundle } from "#lib/features/dom-animation.js";
	import type { ResolvedValues } from "motion-dom";
	import { getPresenceContext } from "../animate-presence/presence.svelte.js";
	import { getPresenceManager } from "../animate-presence/context.js";
	import { getLayoutGroup, getParentMotionState, setParentMotionState } from "../context.js";
	import { getLayoutMotionScope } from "./layout-motion.svelte";
	import { getLazyMotion } from "../lazy-motion/context.js";
	import { MotionState } from "#lib/state/motion-state.js";
	import { createSVGStyles, createStyles } from "#lib/state/style.js";
	import { createAttachmentKey, type Attachment } from "svelte/attachments";
	import { css, watch } from "#lib/vendor/runed/index.js";
	import { invariant, warning } from "hey-listen";
	import { isMotionValue } from "framer-motion/dom";
	import { isValidMotionProp } from "./valid-prop.js";
	import { resolveMotionProps } from "#lib/utils/resolve-motion-props.js";
	import { untrack, type Component } from "svelte";
	import { useMotionConfig } from "../motion-config/index.js";

	interface MotionComponentProps {
		/** The renderer and features of `motion` components; `m` components get theirs from LazyMotion. */
		bundle?: FeatureBundle;
		as: string | Component;
		forwardMotionProps?: boolean;
		props: MotionProps;
		ref: HTMLElement | SVGElement | null;
	}

	let {
		bundle,
		as: AsComponent,
		props,
		ref: externalRef = $bindable(),
		forwardMotionProps = false,
	}: MotionComponentProps = $props();

	const parentState = getParentMotionState();
	const layoutGroup = getLayoutGroup() ?? {};
	const config = useMotionConfig();
	const presenceContext = getPresenceContext();
	const presenceManager = getPresenceManager();
	const lazyMotion = getLazyMotion();
	const layoutScope = getLayoutMotionScope();

	/**
	 * A `motion` component inside LazyMotion breaks the file-size benefits of LazyMotion: `m` components should be
	 * rendered instead.
	 */
	// svelte-ignore state_referenced_locally - checked once, when the component is created
	if (process.env.NODE_ENV !== "production" && bundle && lazyMotion?.strict) {
		const strictMessage =
			"You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
		props.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}

	const motionOptions = $derived(resolveMotionProps(props, { layoutGroup, presenceContext, config: config() }));

	// svelte-ignore state_referenced_locally - the state starts with the initial options; the watch below syncs later ones
	const motionState = new MotionState(motionOptions, parentState);
	setParentMotionState(motionState);
	layoutScope?.add(motionState);

	// `motion` components bring their own features. `m` components use the closest LazyMotion's, which may load
	// later; they never pick up features another component happened to load. Pre, so an `m` component's visual
	// element exists before its element mounts.
	// svelte-ignore state_referenced_locally - `bundle` is fixed per motion component
	if (bundle) motionState.setBundle(bundle);
	else if (lazyMotion) {
		watch.pre(
			() => lazyMotion.features,
			(lazyBundle) => motionState.setBundle(lazyBundle)
		);
	}

	/**
	 * AnimatePresence `mode="wait"`: Svelte mounts an entering element while the previous one is still exiting, where
	 * React would only render it afterwards. It stays hidden at its initial values until the exits finish.
	 */
	const isEnterBlocked = $derived(presenceManager?.isWaitBlocked() === true && !motionState.isActive("exit"));
	motionState.isEnterBlocked = () => isEnterBlocked;

	const attrs = $derived.by(() => {
		const isSVG = motionState.type === "svg";
		const attrsProps: Record<string, unknown> & Record<symbol, Attachment> = {};

		// 1) Start from DOM-facing attributes, unwrap MotionValues
		const source = props as Record<PropertyKey, unknown>;
		for (const key of Reflect.ownKeys(source)) {
			if (typeof key === "string") {
				if (OWN_PROPS.has(key) || (isValidMotionProp(key) && !forwardMotionProps)) continue;
				const value = source[key];
				attrsProps[key] = isMotionValue(value) ? value.get() : value;
			} else {
				// Attachments (`{@attach}`) on the motion component go to its element
				attrsProps[key] = source[key] as Attachment;
			}
		}

		// 2) Build styleProps
		const currentValues = (motionState.visualElement?.latestValues || motionState.latestValues) as ResolvedValues;
		let styleSource = isSVG ? {} : currentValues;

		// Opt-in workaround for Chrome IntersectionObserver issue.
		// Chrome's IntersectionObserver correctly computes intersection based on the visible/painted
		// area rather than the layout box. Elements with CSS properties that make them visually
		// invisible (e.g., `clipPath: inset(0% 100% 0% 0%)`) won't trigger `whileInView` because
		// Chrome reports `isIntersecting: false`. When enabled via `inViewOptions.useClipPathWorkaround`,
		// we exclude such properties from inline styles until the animation triggers.
		// @see https://github.com/hanielu/motion-svelte/issues/9
		if (props.whileInView && props.inViewOptions?.useClipPathWorkaround && !motionState.isActive("whileInView")) {
			const { clipPath, ...rest } = styleSource;
			// Skip clipPath if it would fully clip the element (any inset with 100%)
			const clipsFully = typeof clipPath === "string" && clipPath.includes("100%");
			styleSource = clipsFully ? rest : styleSource;
		}

		const styleProps: ResolvedValues = {};
		// Unwrap MotionValues: buildSVGAttrs/buildHTMLStyles expect plain values
		for (const [key, value] of Object.entries({ ...props.style, ...styleSource })) {
			if (value !== undefined) styleProps[key] = isMotionValue(value) ? value.get() : value;
		}

		if (isEnterBlocked) styleProps.display = "none";

		// 3) SVG conversion
		let style: ResolvedValues | null = styleProps;
		if (isSVG) {
			const svg = createSVGStyles({ ...currentValues, ...styleProps }, AsComponent as string, props.style);
			Object.assign(attrsProps, svg.attrs);
			style = svg.style;
		}

		// 4) Drag safety styles
		if (props.drag && props.dragListener !== false) {
			Object.assign(style, {
				userSelect: "none",
				WebkitUserSelect: "none",
				WebkitTouchCallout: "none",
				touchAction: props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`,
			});
		}

		// 5) Final style object
		style = createStyles(style);
		if (style) attrsProps.style = css(style);

		return attrsProps;
	});

	// Sync prop changes into the motion state, after the DOM update as in Vue's onUpdated (a pre watch made layoutId
	// elements flicker when a sibling's layoutDependency changed). Not lazy: options can change between the state's
	// creation and this watch's first run (e.g. an element bound by a parent attachment and passed as
	// dragConstraints), and a lazy first run would swallow that change.
	watch(
		() => motionOptions,
		(options) => {
			if (options === motionState.options) return;
			motionState.updateOptions(options);
			motionState.update();
		}
	);

	// Pre, so it replays before the template unhides the element and the element renders at its initial values: the
	// mount animation may already have run while it was hidden.
	let wasEnterBlocked = false;
	$effect.pre(() => {
		if (isEnterBlocked) {
			wasEnterBlocked = true;
		} else if (wasEnterBlocked) {
			wasEnterBlocked = false;
			if (!motionState.isActive("exit")) motionState.enterFromInitial();
		}
	});

	// Removal bookkeeping for elements that leave without an outro of their own (see `motionExit`): the projection is
	// marked absent and hands its lead on. By now Svelte has detached the element, so this can't measure it.
	$effect.pre(() => () => {
		layoutScope?.delete(motionState);
		motionState.beforeUnmount();
	});

	function nodeRef(node: HTMLElement | SVGElement) {
		externalRef = node;
		// Mounting can run user callbacks synchronously (e.g. onLayoutMeasure). Untracked, so the attachment only
		// re-runs for a new element, not whenever state those callbacks read changes.
		untrack(() => motionState.mount(node));

		return () => {
			motionState.unmount();
			if (externalRef === node) externalRef = null;
		};
	}

	// popLayout pops an exiting element out of flow at its last position, so AnimatePresence keeps measuring it.
	$effect(() => {
		if (!props.exit || !presenceManager) return;
		presenceManager.trackPosition(motionState);
		return () => presenceManager.untrackPosition(motionState);
	});

	/**
	 * Elements with an exit, and layoutId elements without one: their exit is the shared layout handoff to the next
	 * lead, and they stay until it finishes so it can crossfade from them. Nothing exits while the AnimatePresence
	 * itself is being destroyed.
	 */
	const takesPartInExit = () =>
		// The synced options, not the live props: an outroing block's props can depend on state that's gone
		(!!motionState.options.exit || !!motionState.options.layoutId) && presenceContext?.isUnmounting === false;

	/**
	 * Svelte transitions only keep the DOM node alive while MotionState plays the exit; motion drives the actual
	 * animations, and AnimatePresence finishes the outro once the exit completes. The duration is only a safety cap.
	 * Exits and entries use separate `out:`/`in:` directives so the exit always knows it is one (a bidirectional
	 * `transition:` gets `direction: "both"`). Entering needs no hold: `motionEnter` only exists so `introstart`
	 * fires, e.g. when an exiting element comes back.
	 *
	 * The exit is deferred: Svelte calls the returned function in a microtask right after the flush, on every outro,
	 * while it only dispatches `outrostart` a frame later. Starting the exit here keeps it in the same layout pass as
	 * the update that caused it, so running layout animations aren't restarted a frame in.
	 *
	 * Outside AnimatePresence the element leaves right away. Svelte calls this as the outro starts, while the element
	 * is still on the page (it detaches it before running the component's teardowns), so snapshot its layout here: a
	 * layoutId element replacing it animates from that snapshot.
	 */
	function motionExit(node: Element) {
		if (!presenceManager) {
			motionState.beforeUnmount();
			return {};
		}
		return () => (takesPartInExit() && presenceManager.onOutroStart(node) ? { duration: EXIT_HOLD_LIMIT } : {});
	}
	const motionEnter = (_node: Element) => ({});

	const onintrostart = () => takesPartInExit() && presenceManager?.onIntroStart(motionState.element!);
	const onoutrostart = () => takesPartInExit() && presenceManager?.onOutroBegin(motionState.element!);
	const onoutroend = () => takesPartInExit() && presenceManager?.onOutroEnd(motionState.element!);

	const key = createAttachmentKey();
	const sharedProps = $derived({
		...attrs,
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
