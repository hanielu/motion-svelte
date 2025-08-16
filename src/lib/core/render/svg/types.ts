import type { SvelteHTMLElements, SVGAttributes } from "svelte/elements";
import type { MakeMotion, MotionProps } from "../../motion/types.js";
import type { HTMLRenderState } from "../html/types.js";
import type { Component } from "svelte";
import type { ResolvedValues } from "../types.js";
import type { SVGElements } from "./supported-elements.js";

export interface SVGRenderState extends HTMLRenderState {
  /**
   * A mutable record of attributes we want to apply directly to the rendered Element
   * every frame. We use a mutable data structure to reduce GC during animations.
   */
  attrs: ResolvedValues;
}

interface SVGAttributesWithoutMotionProps<T extends EventTarget>
  extends Pick<SVGAttributes<T>, Exclude<keyof SVGAttributes<T>, keyof MotionProps>> {}

/**
 * Blanket-accept any SVG attribute as a `MotionValue`
 * @public
 */
export type SVGAttributesAsMotionValues<T extends EventTarget> = MakeMotion<
  SVGAttributesWithoutMotionProps<T>
>;

export type UnwrapSVGFactoryElement<F> = F extends SVGAttributes<infer P> ? P : never;

/**
 * @public
 */
export interface SVGMotionProps<T extends EventTarget>
  extends SVGAttributesAsMotionValues<T>,
    MotionProps {}

/**
 * Motion-optimised versions of React's SVG components.
 *
 * @public
 */
export type SVGMotionComponents = {
  [K in SVGElements]: Component<SVGMotionProps<UnwrapSVGFactoryElement<SvelteHTMLElements[K]>>>;
};
