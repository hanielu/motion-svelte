import type { MotionValue } from "framer-motion/dom";
import { createSubscriber } from "svelte/reactivity";

class CurrentMotionValue<T> {
	#value: MotionValue<T>;
	#subscribe: () => void;

	constructor(value: MotionValue<T>) {
		this.#value = value;
		this.#subscribe = createSubscriber((update) => value.on("change", update));
	}

	get current() {
		this.#subscribe();
		return this.#value.get();
	}
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
 *   import { useMotionValue, useCurrentMotionValue } from 'motion-sv';
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
export function useCurrentMotionValue<T>(value: MotionValue<T>) {
	return new CurrentMotionValue(value);
}
