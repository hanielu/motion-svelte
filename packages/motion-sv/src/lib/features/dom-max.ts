import { AnimationFeature } from '@/features/animation/animation.js';
import { PressGesture } from '@/features/gestures/press/index.js';
import { HoverGesture } from '@/features/gestures/hover/index.js';
import { InViewGesture } from '@/features/gestures/in-view/index.js';
import { FocusGesture } from '@/features/gestures/focus/index.js';
import { ProjectionFeature } from '@/features/layout/projection.js';
import { DragGesture } from '@/features/gestures/drag/index.js';
import { LayoutFeature } from '@/features/layout/layout.js';
import { PanGesture } from '@/features/gestures/pan/index.js';
import type { Feature } from '@/features/feature.js';

export const domMax = [
	AnimationFeature,
	PressGesture,
	HoverGesture,
	InViewGesture,
	FocusGesture,
	ProjectionFeature,
	PanGesture,
	DragGesture,
	LayoutFeature,
] as unknown as Feature[];
