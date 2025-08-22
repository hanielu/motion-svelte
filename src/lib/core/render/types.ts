import type { AnimationDefinition } from "motion-dom";
import { type AnyResolvedKeyframe, MotionValue } from "motion-dom";
import type { Axis, Box } from "motion-utils";
import type { ReducedMotionConfig } from "../context/motion-config-context.js";
import type { PresenceContextProps } from "../context/presence-context.js";
import type { MotionProps } from "../motion/types.js";
import type { VisualState } from "../motion/utils/use-visual-state.js";
import type { DOMMotionComponents } from "./dom/types.js";
import type { VisualElement } from "./VisualElement.js";
import type { Component } from "svelte";
import type { Getter } from "runed";

export type ScrapeMotionValuesFromProps = (
  props: MotionProps,
  prevProps: MotionProps,
  visualElement?: VisualElement
) => {
  [key: string]: MotionValue | AnyResolvedKeyframe;
};

export type UseRenderState<RenderState = any> = () => RenderState;

export interface VisualElementOptions<Instance, RenderState = any> {
  visualState: VisualState<Instance, RenderState>;
  parent?: VisualElement<unknown>;
  variantParent?: VisualElement<unknown>;
  presenceContext: PresenceContextProps | null;
  props: MotionProps;
  blockInitialAnimation?: boolean;
  reducedMotionConfig?: ReducedMotionConfig;
}

/**
 * A generic set of string/number values
 */
export interface ResolvedValues {
  [key: string]: AnyResolvedKeyframe;
}

export interface VisualElementEventCallbacks {
  BeforeLayoutMeasure: () => void;
  LayoutMeasure: (layout: Box, prevLayout?: Box) => void;
  LayoutUpdate: (layout: Axis, prevLayout: Axis) => void;
  Update: (latest: ResolvedValues) => void;
  AnimationStart: (definition: AnimationDefinition) => void;
  AnimationComplete: (definition: AnimationDefinition) => void;
  LayoutAnimationStart: () => void;
  LayoutAnimationComplete: () => void;
  SetAxisTarget: () => void;
  Unmount: () => void;
}

export interface LayoutLifecycles {
  onBeforeLayoutMeasure?(box: Box): void;

  onLayoutMeasure?(box: Box, prevBox: Box): void;

  /**
   * @internal
   */
  onLayoutAnimationStart?(): void;

  /**
   * @internal
   */
  onLayoutAnimationComplete?(): void;
}

export type CreateVisualElement<
  // TODO (haniel): make sure this doesn't mess any other types up
  Props extends Record<string, any> = {},
  TagName extends keyof DOMMotionComponents | string = "div"
> = (
  Component: TagName | string | Component<Props>,
  options: VisualElementOptions<HTMLElement | SVGElement>
) => VisualElement<HTMLElement | SVGElement>;
