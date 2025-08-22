import { AnimationFeature } from '@/features/animation/animation.js';
import { PressGesture } from '@/features/gestures/press/index.js';
import { HoverGesture } from '@/features/gestures/hover/index.js';
import { InViewGesture } from '@/features/gestures/in-view/index.js';
import { FocusGesture } from '@/features/gestures/focus/index.js';
// import { ProjectionFeature } from '@/features/layout/projection'
// import { DragGesture } from '@/features/gestures/drag'
// import { LayoutFeature } from '@/features/layout/layout'
// import { PanGesture } from '@/features/gestures/pan'
import type { Feature } from '@/features/feature.js';

export const domAnimation = [
	AnimationFeature,
	PressGesture,
	HoverGesture,
	InViewGesture,
	FocusGesture,
] as unknown as Feature[];
