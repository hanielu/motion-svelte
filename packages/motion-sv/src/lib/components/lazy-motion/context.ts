import { Context } from "#lib/vendor/runed/index.js";
import type { FeatureBundle } from "#lib/features/dom-animation.js";
import type { FnGetter } from "#lib/types/common.js";

export type LazyMotionContext = {
	features: FnGetter<Partial<FeatureBundle>>;
	strict: boolean;
};

export const LazyMotionContext = new Context<LazyMotionContext>("LazyMotionContext");
