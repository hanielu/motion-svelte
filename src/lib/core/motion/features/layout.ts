import { HTMLProjectionNode } from "../../projection/node/HTMLProjectionNode.js";
import MeasureLayout from "./layout/measure-layout.svelte";
import type { FeaturePackages } from "./types.js";

export const layout: FeaturePackages = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout,
  },
};
