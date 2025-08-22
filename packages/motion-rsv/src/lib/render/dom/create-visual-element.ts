import type { Component } from "svelte";
import type { CreateVisualElement, VisualElementOptions } from "../types.js";
import { HTMLVisualElement } from "../html/HTMLVisualElement.js";
import { SVGVisualElement } from "../svg/SVGVisualElement.js";
import { isSVGComponent } from "./utils/is-svg-component.js";

export const createDomVisualElement: CreateVisualElement = (
  Component: string | Component<Record<string, any>, Record<string, any>, string>,
  options: VisualElementOptions<HTMLElement | SVGElement>
) => {
  return isSVGComponent(Component)
    ? new SVGVisualElement(options)
    : new HTMLVisualElement(options, {
        allowProjection: true,
      });
};
