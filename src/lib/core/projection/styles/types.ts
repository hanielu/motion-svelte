import { type AnyResolvedKeyframe } from "motion-dom";
import type { IProjectionNode } from "../node/types.js";

export type ScaleCorrector = (
  latest: AnyResolvedKeyframe,
  node: IProjectionNode
) => AnyResolvedKeyframe;

export interface ScaleCorrectorDefinition {
  correct: ScaleCorrector;
  applyTo?: string[];
  isCSSVariable?: boolean;
}

export interface ScaleCorrectorMap {
  [key: string]: ScaleCorrectorDefinition;
}
