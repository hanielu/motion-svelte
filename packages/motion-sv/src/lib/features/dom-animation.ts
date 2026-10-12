import { AnimationFeature } from "#lib/features/animation/animation.js";
import { FocusGesture } from "#lib/features/gestures/focus/index.js";
import { PressGesture } from "#lib/features/gestures/press/index.js";
import { HoverGesture } from "#lib/features/gestures/hover/index.js";
import { InViewGesture } from "#lib/features/gestures/in-view/index.js";
import type { Feature } from "#lib/features/feature.js";
import { createVisualElement } from "#lib/state/create-visual-element.js";

export interface FeatureBundle {
	renderer: typeof createVisualElement;
	features: Array<typeof Feature>;
}

export const domAnimation: FeatureBundle = {
	renderer: createVisualElement,
	features: [AnimationFeature, PressGesture, HoverGesture, InViewGesture, FocusGesture],
};
