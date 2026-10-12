import type { MotionValue, MotionValueEventCallbacks } from "framer-motion/dom";

/** Subscribe to a motion value's event for the lifetime of the component. */
export function useMotionValueEvent<V, EventName extends keyof MotionValueEventCallbacks<V>>(
	value: MotionValue<V>,
	event: EventName,
	callback: MotionValueEventCallbacks<V>[EventName]
) {
	$effect(() => value.on(event, callback));
}
