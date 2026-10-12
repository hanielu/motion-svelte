import { isSVGElement } from "#lib/state/utils.js";
import type { AsTag } from "#lib/types/index.js";
import { HTMLVisualElement, SVGVisualElement } from "motion-dom";

export function createVisualElement(Component: AsTag, options: any) {
	return isSVGElement(Component as any) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
}
