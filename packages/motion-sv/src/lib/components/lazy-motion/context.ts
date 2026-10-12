import type { FeatureBundle } from "#lib/features/dom-animation.js";
import { createOptionalContext } from "#lib/utils/optional-context.js";

export interface LazyMotionState {
	/** The loaded bundle; empty until a lazy bundle resolves. */
	readonly features: Partial<FeatureBundle>;
	readonly strict: boolean;
}

export const [getLazyMotion, setLazyMotion] = createOptionalContext<LazyMotionState>();
