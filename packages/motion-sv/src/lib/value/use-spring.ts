import { isMotionValue, motionValue } from "framer-motion/dom";
import type { MotionValue } from "framer-motion/dom";
import type { FollowValueOptions, SpringOptions } from "motion-dom";
import { attachFollow } from "motion-dom";
import { watch, extract, type MaybeGetter } from "runed";

type AnyResolvedKeyframe = string | number;

export function useFollowValue<T extends AnyResolvedKeyframe>(
	source: T | MotionValue<T>,
	options: MaybeGetter<FollowValueOptions> = {}
) {
	const value = motionValue(isMotionValue(source) ? source.get() : source);

	watch(
		() => extract(options),
		(currentOptions) => attachFollow(value, source, currentOptions)
	);

	return value;
}

export function useSpring(
	source: MotionValue<string> | MotionValue<number> | number,
	config: MaybeGetter<SpringOptions> = {}
) {
	const value = motionValue(isMotionValue(source) ? source.get() : source);

	watch(
		() => extract(config),
		(currentConfig) => attachFollow(value, source, { type: "spring", ...currentConfig })
	);

	return value;
}
