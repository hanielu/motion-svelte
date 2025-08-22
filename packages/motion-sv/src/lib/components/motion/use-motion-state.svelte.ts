import type { DOMKeyframesDefinition } from 'framer-motion';
import { AnimatePresenceContext } from '../animate-presence/presence.svelte.js';
import { LayoutGroupContext, MotionStateContext } from '../context.js';
import { LazyMotionContext } from '../lazy-motion/context.js';
import { invariant, warning } from 'hey-listen';
import { isMotionValue } from 'framer-motion/dom';
import { ref } from 'runed';
import { useMotionConfig } from '../motion-config/index.js';
import { untrack } from 'svelte';
import type { MotionProps } from './types.js';

export function useMotionState(getProps: () => MotionProps) {
	const props = getProps();

	// motion context
	const parentState = MotionStateContext.get(null);
	// layout group context
	const layoutGroup = LayoutGroupContext.get({});
	// motion config context
	const config = useMotionConfig();
	// animate presence context
	const animatePresenceContext = AnimatePresenceContext.get({});
	// lazy motion context
	const lazyMotionContext = LazyMotionContext.get({
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
		props.features?.length &&
		lazyMotionContext.strict
	) {
		const strictMessage =
			'You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.';
		props.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}

	// onBeforeMount
	$effect.pre(() => {
		untrack(() => {
			//
		});

		// onBeforeUnmount
		return () => {
			//
		};
	});

	// onMounted
	$effect(() => {
		// onUnmounted
		return () => {
			//
		};
	});

	// onUpdated
	$effect.pre(() => {
		// onBeforeUpdate
		return () => {
			//
		};
	});
}
