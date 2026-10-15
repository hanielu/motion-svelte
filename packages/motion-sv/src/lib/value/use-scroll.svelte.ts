import type { ScrollInfoOptions } from "#lib/types/index.js";
import { isSSR } from "#lib/utils/is.js";
import { scroll } from "framer-motion/dom";
import {
	type AccelerateConfig,
	type AnimationPlaybackControlsWithThen,
	cancelFrame,
	cancelMicrotask,
	frame,
	microtask,
	motionValue,
	supportsScrollTimeline,
	supportsViewTimeline,
} from "motion-dom";
import { offsetToViewTimelineRange } from "./scroll/offsets.js";
import { extract, type MaybeGetter } from "#lib/vendor/runed/index.js";

export interface UseScrollOptions extends Omit<ScrollInfoOptions, "container" | "target"> {
	container?: HTMLElement | null;
	target?: HTMLElement | null;
}

function createScrollMotionValues() {
	return {
		scrollX: motionValue(0),
		scrollY: motionValue(0),
		scrollXProgress: motionValue(0),
		scrollYProgress: motionValue(0),
	};
}

/**
 * Whether a container or target element is provided but not bound yet. A getter that returns `{ target: element }`
 * provides it from the start, like a React ref whose `current` is still null.
 */
const isPending = (options: UseScrollOptions, key: "container" | "target") => key in options && !options[key];

function canAccelerateScroll(options: UseScrollOptions): boolean {
	if (isSSR) return false;
	return "target" in options
		? supportsViewTimeline() && !!offsetToViewTimelineRange(options.offset)
		: supportsScrollTimeline() && !options.offset;
}

function makeAccelerateConfig(axis: "x" | "y", getOptions: () => UseScrollOptions): AccelerateConfig {
	return {
		factory: (animation: AnimationPlaybackControlsWithThen) => {
			let cleanup: VoidFunction | undefined;
			const start = () => {
				const options = getOptions();
				// Attaching to the window scroll while an element is still unbound would be cached and mistrack.
				if (isPending(options, "container") || isPending(options, "target")) {
					frame.read(start);
					return;
				}
				const { container, target, ...rest } = options;
				cleanup = scroll(animation, { ...rest, axis, container: container ?? undefined, target: target ?? undefined });
			};
			microtask.read(start);
			return () => {
				cancelMicrotask(start);
				cancelFrame(start);
				cleanup?.();
			};
		},
		times: [0, 1],
		keyframes: [0, 1],
		ease: (v: number) => v,
		duration: 1,
	};
}

/**
 * Pass the options as a getter when they read elements that are bound later, or state that changes:
 * `useScroll(() => ({ target: element }))`. It's read again whenever that state changes.
 */
export function useScroll(scrollOptions: MaybeGetter<UseScrollOptions> = {}) {
	const values = createScrollMotionValues();
	const getOptions = () => extract(scrollOptions);

	// Set the acceleration config once, at setup. Elements are resolved when the VisualElement invokes the factory.
	if (canAccelerateScroll(getOptions())) {
		values.scrollXProgress.accelerate = makeAccelerateConfig("x", getOptions);
		values.scrollYProgress.accelerate = makeAccelerateConfig("y", getOptions);
	}

	$effect(() => {
		const { container, target, ...rest } = getOptions();
		return scroll(
			(_progress, { x, y }) => {
				values.scrollX.set(x.current);
				values.scrollXProgress.set(x.progress);
				values.scrollY.set(y.current);
				values.scrollYProgress.set(y.progress);
			},
			{ ...rest, container: container ?? undefined, target: target ?? undefined }
		);
	});

	return values;
}
