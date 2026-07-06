import { AnimationFeature } from "@/features/animation/animation.js";
import { FocusGesture } from "@/features/gestures/focus/index.js";
import { PressGesture } from "@/features/gestures/press/index.js";
import { HoverGesture } from "@/features/gestures/hover/index.js";
import { InViewGesture } from "@/features/gestures/in-view/index.js";
import type { Feature } from "@/features/feature.js";
import { createVisualElement } from "@/state/create-visual-element.js";

export interface FeatureBundle {
	renderer: typeof createVisualElement;
	features: Array<typeof Feature>;
}

export const domAnimation: FeatureBundle = {
	renderer: createVisualElement,
	features: [AnimationFeature, PressGesture, HoverGesture, InViewGesture, FocusGesture],
};
