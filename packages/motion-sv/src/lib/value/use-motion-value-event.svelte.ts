import type { MotionValue, MotionValueEventCallbacks } from "framer-motion/dom";

export function useMotionValueEvent<V, EventName extends keyof MotionValueEventCallbacks<V>>(
	value: MotionValue<V>,
	event: EventName,
	callback: MotionValueEventCallbacks<V>[EventName]
) {
	const unlisten = value.on(event, callback);

	$effect(() => unlisten);

	return unlisten;
}
