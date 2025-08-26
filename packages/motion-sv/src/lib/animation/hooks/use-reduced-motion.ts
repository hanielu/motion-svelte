import { MediaQuery } from "svelte/reactivity";

/**
 * Reactive prefers-reduced-motion.
 */
export function useReducedMotion(fallback: boolean = false) {
	return new MediaQuery("(prefers-reduced-motion: reduce)", fallback);
}
