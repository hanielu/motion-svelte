import type { AnimationType } from "./types.js";

export const variantPriorityOrder: AnimationType[] = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit",
];

export const variantProps = ["initial", ...variantPriorityOrder];
