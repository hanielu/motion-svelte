import { AnimationFeature } from "#lib/features/animation/animation.js";
import type { FeatureBundle } from "#lib/features/dom-animation.js";
import { createVisualElement } from "#lib/state/create-visual-element.js";
import { PressGesture } from "#lib/features/gestures/press/index.js";
import { HoverGesture } from "#lib/features/gestures/hover/index.js";
import { InViewGesture } from "#lib/features/gestures/in-view/index.js";
import { FocusGesture } from "#lib/features/gestures/focus/index.js";
import { ProjectionFeature } from "#lib/features/layout/projection.js";
import { PanGesture } from "#lib/features/gestures/pan/index.js";
import { DragGesture } from "#lib/features/gestures/drag/index.js";
import { LayoutFeature } from "#lib/features/layout/layout.js";

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
