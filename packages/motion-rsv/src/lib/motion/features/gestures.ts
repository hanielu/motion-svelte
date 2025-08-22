import { HoverGesture } from "../../gestures/hover.js";
import { FocusGesture } from "../../gestures/focus.js";
import { PressGesture } from "../../gestures/press.js";
import { InViewFeature } from "./viewport/index.js";
import type { FeaturePackages } from "./types.js";

export const gestureAnimations: FeaturePackages = {
  inView: {
    Feature: InViewFeature,
  },
  tap: {
    Feature: PressGesture,
  },
  focus: {
    Feature: FocusGesture,
  },
  hover: {
    Feature: HoverGesture,
  },
};
