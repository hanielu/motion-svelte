import { isMotionValue } from "motion-dom";
import type { WillChange } from "./types.js";

export function isWillChangeMotionValue(value: any): value is WillChange {
	return Boolean(isMotionValue(value) && (value as WillChange).add);
}
