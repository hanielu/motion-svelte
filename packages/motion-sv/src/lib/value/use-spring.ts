import { isMotionValue, motionValue } from "framer-motion/dom";
import type { MotionValue } from "framer-motion/dom";
import type { FollowValueOptions, SpringOptions } from "motion-dom";
import { attachFollow } from "motion-dom";
import { watch, extract, type MaybeGetter } from "#lib/vendor/runed/index.js";

type AnyResolvedKeyframe = string | number;

/** A literal source widens to its type, so `useSpring(0)` can be set to any number. */
type Widen<T extends AnyResolvedKeyframe> = T extends number ? number : string;

export function useFollowValue<T extends AnyResolvedKeyframe>(
	source: T | MotionValue<T>,
	options: MaybeGetter<FollowValueOptions> = {}
): MotionValue<Widen<T>> {
	const value = motionValue(isMotionValue(source) ? source.get() : source);

	watch(
		() => extract(options),
		(currentOptions) => attachFollow(value, source, currentOptions)
	);

	return value as MotionValue<Widen<T>>;
}

export function useSpring<T extends AnyResolvedKeyframe>(
	source: T | MotionValue<T>,
	config: MaybeGetter<SpringOptions & Pick<FollowValueOptions, "skipInitialAnimation">> = {}
): MotionValue<Widen<T>> {
	return useFollowValue(source, () => ({ type: "spring", ...extract(config) }));
}
