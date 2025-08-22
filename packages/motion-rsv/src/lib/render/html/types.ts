import type { ResolvedValues } from "../types.js";
import type { MotionProps } from "../../motion/types.js";
import type { HTMLElements } from "./supported-elements.js";
import type { SvelteHTMLElements } from "svelte/elements";
import type { Component } from "svelte";

export interface TransformOrigin {
  originX?: number | string;
  originY?: number | string;
  originZ?: number | string;
}

export interface HTMLRenderState {
  /**
   * A mutable record of transforms we want to apply directly to the rendered Element
   * every frame. We use a mutable data structure to reduce GC during animations.
   */
  transform: ResolvedValues;

  /**
   * A mutable record of transform origins we want to apply directly to the rendered Element
   * every frame. We use a mutable data structure to reduce GC during animations.
   */
  transformOrigin: TransformOrigin;

  /**
   * A mutable record of styles we want to apply directly to the rendered Element
   * every frame. We use a mutable data structure to reduce GC during animations.
   */
  style: ResolvedValues;

  /**
   * A mutable record of CSS variables we want to apply directly to the rendered Element
   * every frame. We use a mutable data structure to reduce GC during animations.
   */
  vars: ResolvedValues;
}

// TODO: (haniel) this is a hack to get the types to work, there has to be a better way
type CommonHTMLProps = Omit<SvelteHTMLElements["div"], "style"> &
  Omit<SvelteHTMLElements["button"], "style">;

export type HTMLMotionProps<Tag extends keyof HTMLElements> = MotionProps & CommonHTMLProps;

/**
 * Motion-optimised versions of Svelte's HTML elements.
 *
 * Each entry is a Svelte component with props corresponding to the element's
 * intrinsic attributes plus Motion props.
 *
 * @public
 */
export type HTMLMotionComponents = {
  [K in keyof HTMLElements]: Component<HTMLMotionProps<K>>;
};
