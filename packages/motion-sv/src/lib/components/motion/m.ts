// import type { MotionComponent } from "./types.js";
import { createMotionComponentWithFeatures } from "./utils.js";

export const m = createMotionComponentWithFeatures();

// this gets into the bundle, even if it's not used
// export const M = m.create("div") as unknown as MotionComponent;
