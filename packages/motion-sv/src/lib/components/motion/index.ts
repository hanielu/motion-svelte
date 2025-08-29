export type { MotionProps } from "./types.js";
import type { MotionComponent } from "./types.js";
import { createMotionComponentWithFeatures } from "./utils.js";
export { createLayoutMotion, STOP_UPDATE, type LayoutMotionNamespace } from "./layout-motion.svelte";
import { domMax } from "@/features/dom-max.js";

export const motion = createMotionComponentWithFeatures(domMax);

// tbh this only exists because of the tests, but it's not exported from the package
// reason being that if it were exported, it would get into the bundle, even if it's not used
export const Motion = motion.create("div");
