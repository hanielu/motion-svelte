import { type AnyResolvedKeyframe, type MotionValue, type TransformOptions, transform } from "motion-dom";
import { useCombineMotionValues, useComputed } from "./use-combine-values.svelte.js";

export type InputRange = number[];

/**
 * Branded wrapper for a getter that returns the **input range** (breakpoints) of a range→range transform.
 * In motion-vue this role is `MaybeRef<InputRange>`; in Svelte use `reactiveInputRange` so the second
 * argument position stays unambiguous (plain functions remain value transformers only).
 */
const ReactiveInputRangeBrand = Symbol.for("motion-sv.reactiveInputRange");

export type ReactiveInputRange = {
	readonly [ReactiveInputRangeBrand]: true;
	readonly read: () => InputRange;
};

/**
 * Mark a getter as a reactive **input range** for `useTransform` (range→range overload).
 *
 * @remarks
 * When breakpoints must update (layout, config, etc.), wrap them with `reactiveInputRange(() => [...])`.
 * Do not pass a bare function for this purpose — unmarked functions in the second position are always
 * interpreted as `SingleTransformer` / `MultiTransformer`.
 *
 * @param read - Getter returning a linear series of numbers (same rules as a static `InputRange`).
 * @returns Opaque value to pass as `inputRange` to `useTransform`.
 *
 * @public
 */
export function reactiveInputRange(read: () => InputRange): ReactiveInputRange {
	return { [ReactiveInputRangeBrand]: true, read };
}

function isReactiveInputRange(value: unknown): value is ReactiveInputRange {
	return typeof value === "object" && value !== null && ReactiveInputRangeBrand in value;
}

type SingleTransformer<I, O> = (input: I) => O;
type MultiTransformer<I, O> = (input: I[]) => O;
type Transformer<I, O> = SingleTransformer<I, O> | MultiTransformer<AnyResolvedKeyframe, O>;

/**
 * Create a `MotionValue` that transforms the output of another `MotionValue` by mapping it from one range of values into another.
 *
 * @remarks
 *
 * Given an input range of `[-200, -100, 100, 200]` and an output range of
 * `[0, 1, 1, 0]`, the returned `MotionValue` will:
 *
 * - When provided a value between `-200` and `-100`, will return a value between `0` and  `1`.
 * - When provided a value between `-100` and `100`, will return `1`.
 * - When provided a value between `100` and `200`, will return a value between `1` and  `0`
 *
 * The input range must be a linear series of numbers. The output range
 * can be any value type supported by Motion: numbers, colors, shadows, etc.
 *
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```svelte
 * <script lang="ts">
 *   import { Motion, motionValue, useTransform } from "motion-sv";
 *
 *   const x = motionValue(0);
 *   const xRange = [-200, -100, 100, 200];
 *   const opacityRange = [0, 1, 1, 0];
 *   const opacity = useTransform(x, xRange, opacityRange);
 * </script>
 *
 * <Motion animate={{ x: 200 }} style={{ opacity, x }} />
 * ```
 *
 * @param inputValue - `MotionValue`
 * @param inputRange - A linear series of numbers (either all increasing or decreasing), or {@link reactiveInputRange} when the breakpoints should be reactive.
 * @param outputRange - A series of numbers, colors or strings. Must be the same length as `inputRange`.
 * @param options -
 *
 *  - clamp: boolean. Clamp values to within the given range. Defaults to `true`
 *  - ease: EasingFunction[]. Easing functions to use on the interpolations between each value in the input and output ranges. If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition between each.
 *
 * @returns `MotionValue`
 *
 * @public
 */
export function useTransform<I, O>(
	value: MotionValue<number>,
	inputRange: InputRange | ReactiveInputRange,
	outputRange: O[],
	options?: TransformOptions<O>
): MotionValue<O>;

export function useTransform<I, O>(transformer: () => O): MotionValue<O>;

export function useTransform<I, O>(input: MotionValue<I>, transformer: SingleTransformer<I, O>): MotionValue<O>;

export function useTransform<I, O>(
	input: MotionValue<string>[] | MotionValue<number>[] | MotionValue<AnyResolvedKeyframe>[],
	transformer: MultiTransformer<I, O>
): MotionValue<O>;

/**
 * Create multiple `MotionValue`s that transform the output of a single `MotionValue`.
 *
 * @remarks
 *
 * Allows transforming a single input into multiple outputs, useful for coordinated animations.
 *
 * ```svelte
 * <script lang="ts">
 *   import { Motion, useMotionValue, useTransform } from "motion-sv";
 *
 *   const x = useMotionValue(0);
 *   const { opacity, scale } = useTransform(x, [0, 100], {
 *     opacity: [0, 1],
 *     scale: [0.5, 1],
 *   });
 * </script>
 *
 * <Motion animate={{ x: 100 }} style={{ opacity, scale, x }} />
 * ```
 *
 * @param value - `MotionValue` to transform
 * @param inputRange - A linear series of numbers (either all increasing or decreasing), or {@link reactiveInputRange} when reactive.
 * @param outputRange - An object where each key maps to an output range array
 * @param options - Transform options (clamp, ease)
 *
 * @returns Object containing `MotionValue` for each output key
 *
 * @public
 */
export function useTransform<O>(
	value: MotionValue<number>,
	inputRange: InputRange | ReactiveInputRange,
	outputRange: { [K in keyof O]: O[K][] },
	options?: TransformOptions<O[keyof O]>
): { [K in keyof O]: MotionValue<O[K]> };

// Implementation
export function useTransform<I, O>(
	input: MotionValue<I> | MotionValue<string>[] | MotionValue<number>[] | MotionValue<string | number>[] | (() => O),
	inputRangeOrTransformer?: InputRange | ReactiveInputRange | Transformer<I, O>,
	outputRange?: O[] | { [K in keyof O]: O[K][] },
	options?: TransformOptions<O>
): MotionValue<O> | { [K in keyof O]: MotionValue<O[K]> } {
	if (typeof input === "function") return useComputed(input);

	// One output per key of the output range
	if (outputRange && !Array.isArray(outputRange) && !Array.isArray(input)) {
		const result = {} as { [K in keyof O]: MotionValue<O[K]> };
		for (const key of Object.keys(outputRange) as Array<keyof O>) {
			result[key] = useTransform(
				input as MotionValue<unknown> as MotionValue<number>,
				inputRangeOrTransformer as InputRange | ReactiveInputRange,
				outputRange[key],
				options as TransformOptions<O[keyof O]>
			);
		}
		return result;
	}

	const inputs: MotionValue[] = Array.isArray(input) ? input : [input];
	const rangeOrTransformer = inputRangeOrTransformer!;
	const outputs = outputRange as O[];
	// A reactive input range rebuilds the transformer, which recomputes the output
	const transformer = $derived(
		(typeof rangeOrTransformer === "function"
			? rangeOrTransformer
			: transform(
					isReactiveInputRange(rangeOrTransformer) ? rangeOrTransformer.read() : rangeOrTransformer,
					outputs,
					options
				)) as (latest: unknown) => O
	);

	const latest: unknown[] = [];
	const result = useCombineMotionValues(inputs, () => {
		for (let i = 0; i < inputs.length; i++) latest[i] = inputs[i].get();
		return transformer(Array.isArray(input) ? latest : latest[0]);
	});

	// Propagate accelerate config for native scroll timeline support.
	// When the input is a scroll progress MotionValue with an accelerate config
	// (set by useScroll), we forward it to the output with updated times/keyframes
	// so the motion component can use a native scroll timeline for this transform.
	const inputAccelerate = Array.isArray(input) ? undefined : input.accelerate;
	if (
		inputAccelerate &&
		!inputAccelerate.isTransformed &&
		typeof rangeOrTransformer !== "function" &&
		outputs &&
		options?.clamp !== false
	) {
		result.accelerate = {
			...inputAccelerate,
			times: isReactiveInputRange(rangeOrTransformer) ? rangeOrTransformer.read() : rangeOrTransformer,
			keyframes: outputs,
			isTransformed: true,
			...(options?.ease ? { ease: options.ease } : {}),
		};
	}

	return result;
}
