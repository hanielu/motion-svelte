<script lang="ts" module>
	import type { DOMKeyframesDefinition } from 'framer-motion';
	import { AnimatePresenceContext } from '../animate-presence/presence.svelte.js';
	import { LayoutGroupContext, MotionStateContext } from '../context.js';
	import { LazyMotionContext } from '../lazy-motion/context.js';
	import { invariant, warning } from 'hey-listen';
	import { isMotionValue } from 'framer-motion/dom';
	import { css, ref, watch } from 'runed';
	import { useMotionConfig } from '../motion-config/index.js';
	import { untrack, type Component } from 'svelte';
	import type { MotionProps } from './types.js';
	import type { Feature } from '@/features/feature.js';
	import { MotionState } from '@/state/motion-state.js';
	import type { Options } from '@/types/state.js';
	import { isValidMotionProp } from './valid-prop.js';
	import { convertSvgStyleToAttributes, createStyles } from '@/state/style.js';
	import type { Attachment } from 'svelte/attachments';
	import { LayoutMotionScopeContext } from './layout-motion.svelte';

	const INTERNAL_MOTION_KEYS = [
		'as',
		'layout',
		'layoutId',
		'layoutScroll',
		'layoutRoot',
		'crossfade',
		'transition',
		'variants',
		'initial',
		'animate',
		'exit',
		'whileHover',
		'whilePress',
		'whileFocus',
		'whileInView',
		'drag',
		'dragListener',
		'dragConstraints',
		'inViewOptions',
		'custom',
		'motionConfig',
	] as const satisfies readonly (keyof Options)[];

	type InternalMotionKey = (typeof INTERNAL_MOTION_KEYS)[number];

	const INTERNAL_MOTION_SET: ReadonlySet<InternalMotionKey> = new Set(INTERNAL_MOTION_KEYS);
</script>

<script lang="ts">
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
		// props: actualProps,
		ref: externalRef = $bindable(),
		forwardMotionProps = false,
	}: MotionComponentProps = $props();

	// let { as, style, layout, layoutId, transition, drag, dragListener, initial, ignoreStrict }: MotionProps = $props();

	// const {
	// 	style: styleProp,
	// 	layout,
	// 	layoutId,
	// 	transition,
	// 	drag,
	// 	dragListener,
	// 	initial,
	// 	ignoreStrict,
	// 	inViewOptions,
	// 	children,
	// 	...rest
	// } = $derived(actualProps);

	// motion context
	const parentState = MotionStateContext.getOr(null);
	// layout group context
	const layoutGroup = LayoutGroupContext.getOr({});
	// motion config context
	const config = useMotionConfig();
	// animate presence context
	const animatePresenceContext = AnimatePresenceContext.getOr({});
	// lazy motion context
	const lazyMotionContext = LazyMotionContext.getOr({
		features: ref([]),
		strict: false,
	});

	/**
	 * If we're in development mode, check to make sure we're not rendering a motion component
	 * as a child of LazyMotion, as this will break the file-size benefits of using it.
	 */
	if (
		process.env.NODE_ENV !== 'production' &&
		// @ts-expect-error
		features?.length &&
		lazyMotionContext.strict
	) {
		const strictMessage =
			'You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.';
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
		transition: props.transition ?? config.value.transition,
		layoutGroup,
		motionConfig: config.value,
		inViewOptions: props.inViewOptions ?? config.value.inViewOptions,
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
	const state = new MotionState(motionOptions, parentState!);
	MotionStateContext.set(state);

	const layoutMotionScope = LayoutMotionScopeContext.getOr(null);
	if (layoutMotionScope) layoutMotionScope.register(state);

	const getAttrs = $derived.by(() => {
		const isSVG = state.type === 'svg';
		const attrsProps: Record<string | symbol, any> = {};

		// 1) Start from DOM-facing attributes, unwrap MotionValues
		for (const key of Reflect.ownKeys(props)) {
			if (typeof key === 'string') {
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
			...(isSVG ? {} : state.visualElement?.latestValues || state.baseTarget),
		};

		// 3) SVG conversion
		if (isSVG) {
			const { attrs, style } = convertSvgStyleToAttributes({
				...(state.isMounted() ? state.target : state.baseTarget),
				...styleProps,
			} as DOMKeyframesDefinition);

			if (style.transform || attrs.transformOrigin) {
				style.transformOrigin = attrs.transformOrigin ?? '50% 50%';
				delete attrs.transformOrigin;
			}
			if (style.transform) {
				style.transformBox = style.transformBox ?? 'fill-box';
				delete attrs.transformBox;
			}

			Object.assign(attrsProps, attrs);
			styleProps = style as Record<string, any>;
		}

		// 4) Drag safety styles
		if (props.drag && props.dragListener !== false) {
			Object.assign(styleProps, {
				userSelect: 'none',
				WebkitUserSelect: 'none',
				WebkitTouchCallout: 'none',
				touchAction: props.drag === true ? 'none' : `pan-${props.drag === 'x' ? 'y' : 'x'}`,
			});
		}

		// 5) Final style object
		const style = createStyles(styleProps);
		if (style) attrsProps.style = css(style);

		return attrsProps;
	});

	// onBeforeMount
	$effect.pre(() => {
		state.beforeMount();

		// onBeforeUnmount
		return () => {
			if (layoutMotionScope) layoutMotionScope.unregister(state);
			state.beforeUnmount();
		};
	});

	// onBeforeUpdate (not really, svelte doesn't have a beforeUpdate hook)
	// so it doesn't work for layout updates like the vue version
	// instead we use the createLayoutMotion().update() method
	// $effect.pre(() => {
	// 	void motionOptions; // trigger effect
	// 	state.beforeUpdate();
	// });

	// onUpdated
	watch.pre(
		() => motionOptions,
		(options) => {
			state.update(options);
		},
		{ lazy: true }
	);

	// onMounted
	const attachRef: Attachment<HTMLElement | SVGElement> = (node) => {
		externalRef = node;

		state.mount(
			node,
			untrack(() => motionOptions),
			/* isHidden */ false
		);

		// onUnmounted
		return () => {
			state.unmount();
		};
	};
</script>

{#if typeof AsComponent === 'string'}
	<svelte:element this={AsComponent} {...getAttrs} {@attach attachRef}>
		{@render props.children?.()}
	</svelte:element>
{:else}
	<AsComponent {...getAttrs} {@attach attachRef} />
{/if}
