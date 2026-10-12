import { DragGesture } from "../../gestures/drag/index.js";
import { HTMLProjectionNode } from "../../projection/node/HTMLProjectionNode.js";
import { PanGesture } from "../../gestures/pan/index.js";

import MeasureLayout from "./layout/measure-layout.svelte";
import type { FeaturePackages } from "./types.js";

export const drag: FeaturePackages = {
	pan: {
		Feature: PanGesture,
	},
	drag: {
		Feature: DragGesture,
		ProjectionNode: HTMLProjectionNode,
		MeasureLayout,
	},
};
