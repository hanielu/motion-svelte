import type { ScrollInfoOptions } from "@/types/index.js";
import { isSSR } from "@/utils/is.js";
import { scroll } from "framer-motion/dom";
import {
	type AccelerateConfig,
	type AnimationPlaybackControlsWithThen,
	motionValue,
	supportsScrollTimeline,
	supportsViewTimeline,
} from "motion-dom";
import { offsetToViewTimelineRange } from "./scroll/offsets.js";

export interface UseScrollOptions extends Omit<ScrollInfoOptions, "container" | "target"> {
	container?: HTMLElement | null;
	target?: HTMLElement | null;
}

/** Plain object or getter — mirrors Vue’s `MaybeRefOrGetter<UseScrollOptions>`. */
export type UseScrollOptionsInput = UseScrollOptions | (() => UseScrollOptions);
function resolveScrollOptions(input: UseScrollOptionsInput): UseScrollOptions {
	return typeof input === "function" ? input() : input;
}

function createScrollMotionValues() {
	return {
		scrollX: motionValue(0),
		scrollY: motionValue(0),
		scrollXProgress: motionValue(0),
		scrollYProgress: motionValue(0),
	};
}

function canAccelerateScroll(target: () => HTMLElement | undefined, offset: ScrollInfoOptions["offset"]): boolean {
	if (isSSR) return false;
	return target() ? supportsViewTimeline() && !!offsetToViewTimelineRange(offset) : supportsScrollTimeline();
}

function makeAccelerateConfig(axis: "x" | "y", options: () => UseScrollOptions): AccelerateConfig {
	return {
		factory: (animation: AnimationPlaybackControlsWithThen) => {
			const { container, target, ...rest } = options();
			return scroll(animation, {
				...rest,
				axis,
				container: container,
				target: target,
			});
		},
		times: [0, 1],
		keyframes: [0, 1],
		ease: (v: number) => v,
		duration: 1,
	};
}

export function useScroll(scrollOptions: UseScrollOptions = {}) {
	const values = createScrollMotionValues();
	const getOptions = () => resolveScrollOptions(scrollOptions);

	// Set acceleration config once at setup time if browser supports it.
	// The factory lazily resolves options at invocation time,
	// so it always gets current values when the VisualElement invokes it.
	// Note: when options is a getter, target/offset are resolved here at
	// construction time (before onMounted), so target will be undefined.
	// This means getter-wrapped targets always use the ScrollTimeline path
	// rather than ViewTimeline — the same behaviour as React's useScroll.
	const { target, offset } = getOptions();
	if (canAccelerateScroll(() => target, offset)) {
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
			{
				...rest,
				container,
				target,
			}
		);
	});

	return values;
}
