import { isSVGElement } from "#lib/state/utils.js";
import type { AsTag } from "#lib/types/index.js";
import { HTMLVisualElement, SVGVisualElement, type VisualElementOptions } from "motion-dom";

export function createVisualElement(tag: AsTag, options: VisualElementOptions<HTMLElement & SVGElement>) {
	return isSVGElement(tag) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
}
