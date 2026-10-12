export type { MotionProps } from "./types.js";
export { createLayoutMotion, STOP_UPDATE, type LayoutMotionNamespace } from "./layout-motion.svelte";
import { motion } from "./instance.js";
export { motion };

// For the unit tests. Not exported from the package, as it would end up in every bundle.
export const Motion = motion.create("div");
