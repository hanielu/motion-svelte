import { prefersReducedMotion } from "svelte/motion";

/**
 * Reactive prefers-reduced-motion.
 * Re-exports `prefersReducedMotion` from `svelte/motion`
 */
export function useReducedMotion() {
	return prefersReducedMotion;
}
