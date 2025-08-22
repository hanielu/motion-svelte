import {
  type AnimationScope,
  type DOMKeyframesDefinition,
  type SelectorCache,
  resolveElements,
} from "motion-dom";
import type { ObjectTarget } from "../sequence/types.js";
import { isDOMKeyframes } from "../utils/is-dom-keyframes.js";

export function resolveSubjects<O extends {}>(
  subject: string | Element | Element[] | NodeListOf<Element> | O | O[],
  keyframes: DOMKeyframesDefinition | ObjectTarget<O>,
  scope?: AnimationScope,
  selectorCache?: SelectorCache
) {
  if (typeof subject === "string" && isDOMKeyframes(keyframes)) {
    return resolveElements(subject, scope, selectorCache);
  } else if (subject instanceof NodeList) {
    return Array.from(subject);
  } else if (Array.isArray(subject)) {
    return subject;
  } else {
    return [subject];
  }
}
