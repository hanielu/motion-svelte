import type { AnimationDefinition } from "motion-dom";
import { resolveVariant } from "../../render/utils/resolve-dynamic-variants.js";
import type { VisualElement } from "../../render/VisualElement.js";
import type { VisualElementAnimationOptions } from "./types.js";
import { animateTarget } from "./visual-element-target.js";
import { animateVariant } from "./visual-element-variant.js";

export function animateVisualElement(
	visualElement: VisualElement,
	definition: AnimationDefinition,
	options: VisualElementAnimationOptions = {}
) {
	visualElement.notify("AnimationStart", definition);
	let animation: Promise<any>;

	if (Array.isArray(definition)) {
		const animations = definition.map((variant) => animateVariant(visualElement, variant, options));
		animation = Promise.all(animations);
	} else if (typeof definition === "string") {
		animation = animateVariant(visualElement, definition, options);
	} else {
		const resolvedDefinition =
			typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;

		animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
	}

	return animation.then(() => {
		visualElement.notify("AnimationComplete", definition);
	});
}
