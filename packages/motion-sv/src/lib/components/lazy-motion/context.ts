import { Context } from "runed";
import type { Feature } from "@/features/index.js";
import type { FnGetter } from "@/types/common.js";

export type LazyMotionContext = {
	features: FnGetter<Feature[]>;
	strict: boolean;
};

export const LazyMotionContext = new Context<LazyMotionContext>("LazyMotionContext");
