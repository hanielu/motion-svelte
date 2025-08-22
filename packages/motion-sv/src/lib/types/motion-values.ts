import type { MotionValue } from "framer-motion/dom";
import type { Options } from "./state.js";
import type { AriaAttributes, DOMAttributes, SvelteHTMLElements, SVGAttributes } from "svelte/elements";
import type { ElementType } from "@/types/common.js";

type EventHandlers<E> = {
	[K in keyof E]?: E[K] extends (...args: any) => any ? E[K] : (payload: E[K]) => void;
};
type EventKeys = keyof EventHandlers<DOMAttributes<HTMLElement>>;
interface SVGAttributesWithoutMotionProps
	extends Pick<
		SVGAttributes<SVGElement>,
		Exclude<keyof SVGAttributes<SVGElement>, keyof Options | keyof AriaAttributes | EventKeys>
	> {}

/**
 * @public
 */
export interface CustomValueType {
	mix: (from: any, to: any) => (p: number) => number | string;
	toValue: () => number | string;
}
export type MakeCustomValueType<T> = { [K in keyof T]: T[K] | CustomValueType };

export type MakeMotion<T> = MakeCustomValueType<{
	[K in keyof T]: T[K] | MotionValue<number> | MotionValue<string> | MotionValue<any>; // A permissive type for Custom value types
}>;

/**
 * Blanket-accept any SVG attribute as a `MotionValue`
 * @public
 */
export type SVGAttributesAsMotionValues = MakeMotion<SVGAttributesWithoutMotionProps>;

export interface SVGAttributesWithMotionValues {
	svg: SVGAttributesAsMotionValues;
	animate: SVGAttributesAsMotionValues;
	animateMotion: SVGAttributesAsMotionValues;
	animateTransform: SVGAttributesAsMotionValues;
	circle: SVGAttributesAsMotionValues;
	clipPath: SVGAttributesAsMotionValues;
	defs: SVGAttributesAsMotionValues;
	desc: SVGAttributesAsMotionValues;
	ellipse: SVGAttributesAsMotionValues;
	feBlend: SVGAttributesAsMotionValues;
	feColorMatrix: SVGAttributesAsMotionValues;
	feComponentTransfer: SVGAttributesAsMotionValues;
	feComposite: SVGAttributesAsMotionValues;
	feConvolveMatrix: SVGAttributesAsMotionValues;
	feDiffuseLighting: SVGAttributesAsMotionValues;
	feDisplacementMap: SVGAttributesAsMotionValues;
	feDistantLight: SVGAttributesAsMotionValues;
	feDropShadow: SVGAttributesAsMotionValues;
	feFlood: SVGAttributesAsMotionValues;
	feFuncA: SVGAttributesAsMotionValues;
	feFuncB: SVGAttributesAsMotionValues;
	feFuncG: SVGAttributesAsMotionValues;
	feFuncR: SVGAttributesAsMotionValues;
	feGaussianBlur: SVGAttributesAsMotionValues;
	feImage: SVGAttributesAsMotionValues;
	feMerge: SVGAttributesAsMotionValues;
	feMergeNode: SVGAttributesAsMotionValues;
	feMorphology: SVGAttributesAsMotionValues;
	feOffset: SVGAttributesAsMotionValues;
	fePointLight: SVGAttributesAsMotionValues;
	feSpecularLighting: SVGAttributesAsMotionValues;
	feSpotLight: SVGAttributesAsMotionValues;
	feTile: SVGAttributesAsMotionValues;
	feTurbulence: SVGAttributesAsMotionValues;
	filter: SVGAttributesAsMotionValues;
	foreignObject: SVGAttributesAsMotionValues;
	g: SVGAttributesAsMotionValues;
	image: SVGAttributesAsMotionValues;
	line: SVGAttributesAsMotionValues;
	linearGradient: SVGAttributesAsMotionValues;
	marker: SVGAttributesAsMotionValues;
	mask: SVGAttributesAsMotionValues;
	metadata: SVGAttributesAsMotionValues;
	mpath: SVGAttributesAsMotionValues;
	path: SVGAttributesAsMotionValues;
	pattern: SVGAttributesAsMotionValues;
	polygon: SVGAttributesAsMotionValues;
	polyline: SVGAttributesAsMotionValues;
	radialGradient: SVGAttributesAsMotionValues;
	rect: SVGAttributesAsMotionValues;
	stop: SVGAttributesAsMotionValues;
	switch: SVGAttributesAsMotionValues;
	symbol: SVGAttributesAsMotionValues;
	text: SVGAttributesAsMotionValues;
	textPath: SVGAttributesAsMotionValues;
	tspan: SVGAttributesAsMotionValues;
	use: SVGAttributesAsMotionValues;
	view: SVGAttributesAsMotionValues;
}

export type SetMotionValueType<T, Keys extends keyof T> = {
	[K in keyof T]: K extends Keys ? SVGAttributesAsMotionValues : T[K];
};

type IntrinsicElementAttributesAsMotionValues = SetMotionValueType<
	SvelteHTMLElements,
	keyof SVGAttributesWithMotionValues
>;
export type MotionHTMLAttributes<C extends ElementType> = Omit<
	IntrinsicElementAttributesAsMotionValues[C],
	keyof Options | "style" | "as" | "asChild"
>;
