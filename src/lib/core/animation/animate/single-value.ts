import {
  type AnimationPlaybackControlsWithThen,
  type AnyResolvedKeyframe,
  motionValue as createMotionValue,
  isMotionValue,
  type MotionValue,
  type UnresolvedValueKeyframe,
  type ValueAnimationTransition,
} from "motion-dom";
import { animateMotionValue } from "../interfaces/motion-value.js";

export function animateSingleValue<V extends AnyResolvedKeyframe>(
  value: MotionValue<V> | V,
  keyframes: V | UnresolvedValueKeyframe<V>[],
  options?: ValueAnimationTransition
): AnimationPlaybackControlsWithThen {
  const motionValue = isMotionValue(value) ? value : createMotionValue(value);

  motionValue.start(animateMotionValue("", motionValue, keyframes, options));

  return motionValue.animation!;
}
