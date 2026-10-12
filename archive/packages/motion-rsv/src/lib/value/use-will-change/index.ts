import { WillChangeMotionValue } from "./WillChangeMotionValue.js";
import type { WillChange } from "./types.js";

export function useWillChange(): WillChange {
	return new WillChangeMotionValue("auto");
}
