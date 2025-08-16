import {
  type AnyResolvedKeyframe,
  defaultTransformValue,
  isCSSVariableName,
  readTransformValue,
  transformProps,
} from "motion-dom";
import type { Box } from "motion-utils";
import type { MotionConfigContext } from "../../context/motion-config-context.js";
import type { MotionProps } from "../../motion/types.js";
import { measureViewportBox } from "../../projection/utils/measure.js";
import { nextSeq } from "$lib/utils/debug-seq.js";
import { DOMVisualElement } from "../dom/DOMVisualElement.js";
import type { DOMVisualElementOptions } from "../dom/types.js";
import type { ResolvedValues } from "../types.js";
import { VisualElement } from "../VisualElement.js";
import type { HTMLRenderState } from "./types.js";
import { buildHTMLStyles } from "./utils/build-styles.js";
import { renderHTML } from "./utils/render.js";
import { scrapeMotionValuesFromProps } from "./utils/scrape-motion-values.js";

export function getComputedStyle(element: HTMLElement) {
  return window.getComputedStyle(element);
}

export class HTMLVisualElement extends DOMVisualElement<
  HTMLElement,
  HTMLRenderState,
  DOMVisualElementOptions
> {
  type = "html";

  readValueFromInstance(
    instance: HTMLElement,
    key: string
  ): AnyResolvedKeyframe | null | undefined {
    if (transformProps.has(key)) {
      return this.projection?.isProjecting
        ? defaultTransformValue(key)
        : readTransformValue(instance, key);
    } else {
      const computedStyle = getComputedStyle(instance);
      const value =
        (isCSSVariableName(key)
          ? computedStyle.getPropertyValue(key)
          : computedStyle[key as keyof typeof computedStyle]) || 0;

      return typeof value === "string" ? value.trim() : (value as number);
    }
  }

  measureInstanceViewportBox(
    instance: HTMLElement,
    { transformPagePoint }: MotionProps & Partial<MotionConfigContext>
  ): Box {
    const box = measureViewportBox(instance, transformPagePoint);
    try {
      const r = instance.getBoundingClientRect();
      console.log(
        "[haniel][",
        nextSeq(),
        "][measureViewport] node=",
        instance.tagName,
        "rect=",
        { x: r.x, y: r.y, w: r.width, h: r.height },
        "latestValuesTransforms=",
        {
          x: (this as any).latestValues?.x,
          y: (this as any).latestValues?.y,
          scale: (this as any).latestValues?.scale,
          scaleX: (this as any).latestValues?.scaleX,
          scaleY: (this as any).latestValues?.scaleY,
        }
      );
    } catch {}
    return box;
  }

  build(renderState: HTMLRenderState, latestValues: ResolvedValues, props: MotionProps) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }

  scrapeMotionValuesFromProps(
    props: MotionProps,
    prevProps: MotionProps,
    visualElement: VisualElement
  ) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }

  renderInstance = renderHTML;
}
