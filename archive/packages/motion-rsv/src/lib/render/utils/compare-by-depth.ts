import type { VisualElement } from "../VisualElement.js";

export interface WithDepth {
	depth: number;
}

export const compareByDepth = (a: VisualElement, b: VisualElement) => a.depth - b.depth;
