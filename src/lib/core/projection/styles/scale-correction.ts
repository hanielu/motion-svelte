import { isCSSVariableName } from "motion-dom";
import type { ScaleCorrectorMap } from "./types.js";

export const scaleCorrectors: ScaleCorrectorMap = {};

export function addScaleCorrector(correctors: ScaleCorrectorMap) {
  for (const key in correctors) {
    scaleCorrectors[key] = correctors[key];
    if (isCSSVariableName(key)) {
      scaleCorrectors[key].isCSSVariable = true;
    }
  }
}
