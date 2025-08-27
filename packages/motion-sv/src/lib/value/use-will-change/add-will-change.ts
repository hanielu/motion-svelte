import { isWillChangeMotionValue } from "@/value/use-will-change/is.js";
import type { VisualElement } from "framer-motion/types";

export function addValueToWillChange(visualElement: VisualElement, key: string) {
	const willChange = visualElement.getValue("willChange");

	/**
	 * It could be that a user has set willChange to a regular MotionValue,
	 * in which case we can't add the value to it.
	 */
	if (isWillChangeMotionValue(willChange)) {
		return willChange.add(key);
	}
}
