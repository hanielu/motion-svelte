import type { MotionComponent } from "./types.js";
import { createMotionComponentWithFeatures } from "./utils.js";

export const m = createMotionComponentWithFeatures();
export const M = m.create("div") as unknown as MotionComponent;
