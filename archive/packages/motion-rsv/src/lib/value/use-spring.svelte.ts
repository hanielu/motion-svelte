import { type AnyResolvedKeyframe, attachSpring, isMotionValue, MotionValue, type SpringOptions } from "motion-dom";
// import { useContext, useInsertionEffect } from "react"
import { MotionConfigContext } from "../context/motion-config-context.js";
import { useMotionValue } from "./use-motion-value.js";
import { useTransform } from "./use-transform.js";

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
export function useSpring(source: MotionValue<string>, options?: SpringOptions): MotionValue<string>;
export function useSpring(source: string, options?: SpringOptions): MotionValue<string>;
export function useSpring(source: MotionValue<number>, options?: SpringOptions): MotionValue<number>;
export function useSpring(source: number, options?: SpringOptions): MotionValue<number>;
export function useSpring(
	source: MotionValue<string> | MotionValue<number> | AnyResolvedKeyframe,
	options: SpringOptions = {}
) {
	const isStatic = $derived(MotionConfigContext.current.isStatic);
	const getFromSource = () => (isMotionValue(source) ? source.get() : source);

	// isStatic will never change, allowing early hooks return
	if (isStatic) {
		return useTransform(getFromSource);
	}

	const value = useMotionValue(getFromSource());

	$effect.pre(() => {
		return attachSpring(value, source, options);
	});

	return value;
}
