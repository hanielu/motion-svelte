import type {
	DOMKeyframesDefinition,
	LegacyAnimationControls,
	MotionPath,
	MotionValue,
	ResolvedValues,
	TransformProperties,
	VariantLabels,
	Variants,
} from "motion-dom";
import type { animate } from "framer-motion/dom";
import type { LayoutOptions } from "#lib/features/layout/types.js";
import type { DragProps } from "#lib/features/gestures/drag/types.js";
import type { PressProps } from "#lib/features/gestures/press/types.js";
import type { HoverProps } from "#lib/features/gestures/hover/types.js";
import type { InViewProps } from "#lib/features/gestures/in-view/types.js";
import type { LayoutGroupState } from "#lib/components/context.js";
import type { PanProps } from "#lib/features/gestures/pan/types.js";
import type { MotionConfigState } from "#lib/components/motion-config/types.js";
import type { $Transition } from "./framer-motion.js";
import type { FocusProps } from "#lib/features/gestures/focus/types.js";
import type { AsTag } from "./common.js";
import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";

type AnimationPlaybackControls = ReturnType<typeof animate>;
export interface VariantType extends DOMKeyframesDefinition {
	transition?: Options["transition"];
	attrX?: DOMKeyframesDefinition["x"];
	attrY?: DOMKeyframesDefinition["y"];
	attrScale?: DOMKeyframesDefinition["scale"];
}

type TransformPropertiesWithoutTransition = Omit<TransformProperties, "transition">;

/**
 * In motion-dom's `Transition` union, the `path` key carries two meanings:
 * the curved-motion factory (`arc()`, typed `MotionPath`) and the SVG `path`
 * attribute's per-value transition (typed `ValueTransition`, and non-optional
 * in the mapped `SVGPathTransitions`). That collision can obscure the
 * `MotionPath` type at call sites like `transition: { path: arc() }`.
 *
 * This distributive override pins `path` to `MotionPath` on every union member
 * while preserving each member's other fields, so `arc()` is accepted cleanly.
 */
type WithMotionPath<T> = T extends any ? Omit<T, "path"> & { path?: MotionPath } : never;

export type MotionStyleProps = Partial<{
	[K in keyof Omit<VariantType & TransformPropertiesWithoutTransition, "attrX" | "attrY" | "attrScale">]:
		string | number | undefined | MotionValue;
}>;

export interface Options<T = any>
	extends LayoutOptions, PressProps, HoverProps, InViewProps, DragProps, PanProps, FocusProps {
	custom?: T;
	as?: AsTag;
	initial?: VariantLabels | VariantType | boolean;
	animate?: VariantLabels | VariantType | LegacyAnimationControls;
	exit?: VariantLabels | VariantType;
	variants?: Variants;
	inherit?: boolean;
	style?: MotionStyleProps;
	transformTemplate?: (transform: TransformProperties, generatedTransform: string) => string;
	transition?: WithMotionPath<$Transition> & {
		layout?: WithMotionPath<$Transition>;
	};
	layoutGroup?: LayoutGroupState;
	motionConfig?: MotionConfigState;
	onAnimationComplete?: (definition: Options["animate"]) => void;
	onUpdate?: (latest: ResolvedValues) => void;
	onAnimationStart?: (definition: Options["animate"]) => void;

	// Svelte specific
	children?: Snippet;
	class?: ClassValue;
	ref?: HTMLElement | SVGElement | null;

	// is this even svelte specific? idk I just know that it stops errors with Reorder.Item and Reorder.Group
	id?: string;
	// key?: string | number;
}

export interface MotionStateContext {
	initial?: VariantLabels | boolean;
	animate?: VariantLabels;
	inView?: VariantLabels;
	hover?: VariantLabels;
	press?: VariantLabels;
	exit?: VariantLabels;
}

export type AnimationFactory = () => AnimationPlaybackControls | undefined;
