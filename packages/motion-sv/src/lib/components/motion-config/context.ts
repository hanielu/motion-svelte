import { computed, Context, type ComputedRef } from 'runed';
import type { MotionConfigState } from './types.js';

/**
 * Default motion configuration
 */
export const defaultConfig: MotionConfigState = {
	reducedMotion: 'never',
	transition: undefined,
	nonce: undefined,
};

/**
 * Context for sharing motion configuration with child components
 */
export const MotionConfigContext = new Context<ComputedRef<MotionConfigState>>('MotionConfig');

export function useMotionConfig() {
	return MotionConfigContext.getOr(computed(() => defaultConfig));
}
