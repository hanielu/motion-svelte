import { type MotionValue, collectMotionValues } from "framer-motion/dom";
import { useCombineMotionValues } from "./use-combine-values.svelte.js";

export function useComputed<T>(computed: () => T): MotionValue<T> {
	/**
	 * Open session of collectMotionValues. Any MotionValue that calls get()
	 * will be saved into this array.
	 */
	collectMotionValues.current = [];

	const { value, subscribe, unsubscribe, updateValue } = useCombineMotionValues<T>(computed);

	subscribe(collectMotionValues.current);

	collectMotionValues.current = undefined;

	$effect(() => {
		unsubscribe();
		collectMotionValues.current = [];
		updateValue();
		subscribe(collectMotionValues.current);
		collectMotionValues.current = undefined;
	});

	return value;
}
