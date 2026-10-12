import { AnimationFeature } from "@/features/animation/animation.js";
import type { FeatureBundle } from "@/features/dom-animation.js";
import { createVisualElement } from "@/state/create-visual-element.js";
import { PressGesture } from "@/features/gestures/press/index.js";
import { HoverGesture } from "@/features/gestures/hover/index.js";
import { InViewGesture } from "@/features/gestures/in-view/index.js";
import { FocusGesture } from "@/features/gestures/focus/index.js";
import { ProjectionFeature } from "@/features/layout/projection.js";
import { PanGesture } from "@/features/gestures/pan/index.js";
import { DragGesture } from "@/features/gestures/drag/index.js";
import { LayoutFeature } from "@/features/layout/layout.js";

export const domMax: FeatureBundle = {
	renderer: createVisualElement,
	features: [
		AnimationFeature,
		PressGesture,
		HoverGesture,
		InViewGesture,
		FocusGesture,
		ProjectionFeature,
		PanGesture,
		DragGesture,
		LayoutFeature,
	],
};
