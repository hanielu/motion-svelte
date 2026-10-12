import { Context } from "runed";
import type { FeatureBundle } from "@/features/dom-animation.js";
import type { FnGetter } from "@/types/common.js";

export type LazyMotionContext = {
	features: FnGetter<Partial<FeatureBundle>>;
	strict: boolean;
};

export const LazyMotionContext = new Context<LazyMotionContext>("LazyMotionContext");
