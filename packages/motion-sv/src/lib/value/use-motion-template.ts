import type { MotionValue } from "framer-motion/dom";
import { isMotionValue } from "framer-motion/dom";
import { useCombineMotionValues } from "./use-combine-values.svelte.js";

/**
 * Combine multiple motion values into a new one using a string template literal.
 *
 * ```svelte
 * <script setup>
 * import { useSpring, motionValue, useMotionTemplate } from 'motion-sv'
 *
 * const shadowX = useSpring(0)
 * const shadowY = motionValue(0)
 * const shadow = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`
 * </script>
 *
 * <motion.div style={{ filter: shadow }} />
 * ```
 *
 * @public
 */
export function useMotionTemplate(fragments: TemplateStringsArray, ...values: Array<MotionValue | number | string>) {
	/**
	 * Create a function that will build a string from the latest motion values.
	 */
	const numFragments = fragments.length;

	function buildValue() {
		let output = "";

		for (let i = 0; i < numFragments; i++) {
			output += fragments[i];
			const value = values[i];
			if (value) {
				output += isMotionValue(value) ? value.get() : value;
			}
		}

		return output;
	}
	const { value, subscribe } = useCombineMotionValues(buildValue);

	subscribe(values.filter(isMotionValue));

	return value;
}
