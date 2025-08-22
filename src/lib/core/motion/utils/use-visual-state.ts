import type { ScrapeMotionValuesFromProps } from "$lib/core/render/types.js";
import type { AnyResolvedKeyframe, ResolvedValues } from "motion-dom";
import type { MotionProps } from "../types.js";
import { isAnimationControls } from "$lib/core/animation/utils/is-animation-controls.js";
import { MotionContext, type MotionContextProps } from "$lib/core/context/motion-context/index.js";
import { PresenceContext, type PresenceContextProps } from "$lib/core/context/presence-context.js";
import { resolveVariantFromProps } from "$lib/core/render/utils/resolve-variants.js";
import { resolveMotionValue } from "$lib/core/value/utils/resolve-motion-value.js";
import {
  isControllingVariants as checkIsControllingVariants,
  isVariantNode as checkIsVariantNode,
} from "../../render/utils/is-controlling-variants.js";

export interface VisualState<Instance, RenderState> {
  renderState: RenderState;
  latestValues: ResolvedValues;
  onMount?: (instance: Instance) => void;
}

export type UseVisualState<Instance, RenderState> = (
  props: MotionProps,
  isStatic: boolean
) => VisualState<Instance, RenderState>;

export interface UseVisualStateConfig<RenderState> {
  scrapeMotionValuesFromProps: ScrapeMotionValuesFromProps;
  createRenderState: () => RenderState;
}

export const makeUseVisualState =
  <I, RS>(config: UseVisualStateConfig<RS>): UseVisualState<I, RS> =>
  (props: MotionProps, isStatic: boolean): VisualState<I, RS> => {
    const context = MotionContext.get();
    const presenceContext = PresenceContext.get();

    // Component function runs once in Svelte; compute once and keep a stable object.
    return makeState(config, props, context, presenceContext);
  };

function makeState<I, RS>(
  { scrapeMotionValuesFromProps, createRenderState }: UseVisualStateConfig<RS>,
  props: MotionProps,
  context: MotionContextProps,
  presenceContext: PresenceContextProps | null
) {
  const state: VisualState<I, RS> = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
    renderState: createRenderState(),
  };

  return state;
}

function makeLatestValues(
  props: MotionProps,
  context: MotionContextProps,
  presenceContext: PresenceContextProps | null,
  scrapeMotionValues: ScrapeMotionValuesFromProps
) {
  const values: ResolvedValues = {};

  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }

  let { initial, animate } = props;
  // console.log("[haniel] initial", initial);
  const isControllingVariants = checkIsControllingVariants(props);
  const isVariantNode = checkIsVariantNode(props);

  if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
    if (initial === undefined) initial = context.initial;
    if (animate === undefined) animate = context.animate;
  }

  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;

  const variantToSet = isInitialAnimationBlocked ? animate : initial;

  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i] as any);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key as keyof typeof target];

          if (Array.isArray(valueTarget)) {
            /**
             * Take final keyframe if the initial animation is blocked because
             * we want to initialise at the end of that blocked animation.
             */
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index] as any;
          }

          if (valueTarget !== null) {
            values[key] = valueTarget as AnyResolvedKeyframe;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key as keyof typeof transitionEnd] as AnyResolvedKeyframe;
        }
      }
    }
  }

  return values;
}
