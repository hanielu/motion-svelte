import { type MotionValue, cancelFrame, collectMotionValues, frame, motionValue } from "motion-dom";
import { untrack } from "svelte";

/** Run `update` once per frame whenever one of `values` changes. Returns the unsubscribe function. */
function followValues(values: MotionValue[], update: VoidFunction) {
	const scheduleUpdate = () => frame.preRender(update, false, true);
	const subscriptions = values.map((value) => value.on("change", scheduleUpdate));
	return () => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
		cancelFrame(update);
	};
}

/**
 * A motion value computed by `combine` from `values`, once per frame whenever one of them changes. Svelte state
 * that `combine` reads recomputes it too, as a React re-render would.
 */
export function useCombineMotionValues<T>(values: MotionValue[], combine: () => T) {
	const value = motionValue(combine());
	const update = () => value.set(combine());

	$effect(() => {
		const latest = combine();
		// Untracked: listeners of the combined value must not make this effect resubscribe
		untrack(() => value.set(latest));
		return followValues(values, update);
	});

	return value;
}

/**
 * A motion value computed by `compute` from the motion values it reads, once per frame whenever one of them
 * changes. Svelte state it reads recomputes it, and collects its motion values again.
 */
export function useComputed<T>(compute: () => T) {
	const value = motionValue(compute());
	const update = () => value.set(compute());

	$effect(() => {
		collectMotionValues.current = [];
		let latest: T;
		let values: MotionValue[];
		try {
			latest = compute();
		} finally {
			values = collectMotionValues.current;
			collectMotionValues.current = undefined;
		}
		untrack(() => value.set(latest));
		return followValues(values, update);
	});

	return value;
}
