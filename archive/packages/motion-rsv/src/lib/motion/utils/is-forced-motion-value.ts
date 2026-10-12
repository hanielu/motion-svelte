import { transformProps } from "motion-dom";
import type { MotionProps } from "../types.js";
import { scaleCorrectors } from "../../projection/styles/scale-correction.js";

export function isForcedMotionValue(key: string, { layout, layoutId }: MotionProps) {
	return (
		transformProps.has(key) ||
		key.startsWith("origin") ||
		((layout || layoutId !== undefined) && (!!scaleCorrectors[key] || key === "opacity"))
	);
}
