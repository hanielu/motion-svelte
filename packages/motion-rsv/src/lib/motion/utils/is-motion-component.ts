import type { Component } from "svelte";
import { motionComponentSymbol } from "./symbol.js";

/**
 * Checks if a component is a `motion` component.
 */
export function isMotionComponent(component: Component | string) {
  return component !== null && typeof component === "object" && motionComponentSymbol in component;
}
