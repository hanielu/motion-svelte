import type { DOMKeyframesDefinition, ResolvedValues, VariantLabels, Variants } from "framer-motion";
import type { MotionValue, TransformProperties, animate } from "framer-motion/dom";
import type { LayoutOptions } from "@/features/layout/types.js";
import type { DragProps } from "@/features/gestures/drag/types.js";
import type { PressProps } from "@/features/gestures/press/types.js";
import type { HoverProps } from "@/features/gestures/hover/types.js";
import type { InViewProps } from "@/features/gestures/in-view/types.js";
import type { LayoutGroupState } from "@/components/context.js";
import type { PanProps } from "@/features/gestures/pan/types.js";
import type { MotionConfigState } from "@/components/motion-config/types.js";
import type { $Transition } from "./framer-motion.js";
import type { FocusProps } from "@/features/gestures/focus/types.js";
import type { AnimationControls } from "@/animation/types.js";
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

interface BoundingBox {
	top: number;
	right: number;
	bottom: number;
	left: number;
}
export interface DragOptions {
	constraints?: false | Partial<BoundingBox>;
	dragSnapToOrigin?: boolean;
}

type TransformPropertiesWithoutTransition = Omit<TransformProperties, "transition">;
export type MotionStyle = Partial<{
	[K in keyof Omit<VariantType & TransformPropertiesWithoutTransition, "attrX" | "attrY" | "attrScale">]:
		| string
		| number
		| undefined
		| MotionValue;
}>;

export interface Options<T = any>
	extends LayoutOptions,
		PressProps,
		HoverProps,
		InViewProps,
		DragProps,
		PanProps,
		FocusProps {
	custom?: T;
	as?: AsTag;
	initial?: VariantLabels | VariantType | boolean;
	animate?: VariantLabels | VariantType | AnimationControls;
	exit?: VariantLabels | VariantType;
	variants?: Variants;
	inherit?: boolean;
	style?: MotionStyle;
	transformTemplate?: (transform: TransformProperties, generatedTransform: string) => string;
	transition?: $Transition & {
		layout?: $Transition;
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

export interface CssPropertyDefinition {
	syntax: `<${string}>`;
	initialValue: string | number;
	toDefaultUnit: (v: number) => string | number;
}

export type CssPropertyDefinitionMap = { [key: string]: CssPropertyDefinition };
