import {
  type AnimationPlaybackControlsWithThen,
  type AnimationScope,
  type DOMKeyframesDefinition,
  type AnimationOptions as DynamicAnimationOptions,
  type ElementOrSelector,
  GroupAnimationWithThen,
} from "motion-dom";
import { animateElements } from "./animate-elements.js";

export const createScopedWaapiAnimate = (scope?: AnimationScope) => {
  function scopedAnimate(
    elementOrSelector: ElementOrSelector,
    keyframes: DOMKeyframesDefinition,
    options?: DynamicAnimationOptions
  ): AnimationPlaybackControlsWithThen {
    return new GroupAnimationWithThen(
      animateElements(elementOrSelector, keyframes as DOMKeyframesDefinition, options, scope)
    );
  }

  return scopedAnimate;
};

export const animateMini = /*@__PURE__*/ createScopedWaapiAnimate();
