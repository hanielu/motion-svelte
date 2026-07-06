import { isSVGElement } from "@/state/utils.js";
import type { AsTag } from "@/types/index.js";
import { HTMLVisualElement, SVGVisualElement } from "motion-dom";

export function createVisualElement(Component: AsTag, options: any) {
	return isSVGElement(Component as any) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
}
