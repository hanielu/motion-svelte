import type { Transition } from "motion-dom";
import type { AnimationType } from "../../render/utils/types.js";

export type VisualElementAnimationOptions = {
  delay?: number;
  transitionOverride?: Transition;
  custom?: any;
  type?: AnimationType;
};
