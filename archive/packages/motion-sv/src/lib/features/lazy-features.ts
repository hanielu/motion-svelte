import type { Feature } from "@/features/feature.js";

/**
 * Global lazy-loaded features registry.
 * Updated by the Motion component when LazyMotion context provides features.
 * Read by MotionState during feature initialization.
 */
export const lazyFeatures: Array<typeof Feature> = [];

/**
 * Update the global lazy features array.
 * Called from the Motion component when LazyMotion context features change.
 */
export function updateLazyFeatures(features: Array<typeof Feature>) {
	for (const feature of features) {
		if (feature && !lazyFeatures.includes(feature)) {
			lazyFeatures.push(feature);
		}
	}
}
