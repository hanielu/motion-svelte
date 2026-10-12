import type { MotionValue } from "framer-motion/dom";

export interface CurrentMotionValue<T> {
	readonly current: T;
}

/**
 * Creates a reactive wrapper around a MotionValue that provides a `current` getter,
 * similar to Svelte's native `Tween` and `Spring` classes.
 *
 * This allows you to use MotionValue in reactive contexts where `.get()` wouldn't
 * trigger reactivity.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useMotionValue, useCurrentMotionValue } from 'motion-svelte';
 *
 *   const x = useMotionValue(0);
 *   const reactiveX = useCurrentMotionValue(x);
 * </script>
 *
 * <p>Current x: {reactiveX.current}</p>
 * ```
 *
 * @param value - The MotionValue to make reactive
 * @returns An object with a reactive `current` getter
 */
export function useCurrentMotionValue<T>(value: MotionValue<T>): CurrentMotionValue<T> {
	let current = $state(value.get());

	$effect(() => value.on("change", (latest) => (current = latest)));

	return {
		get current() {
			return current;
		},
	};
}
