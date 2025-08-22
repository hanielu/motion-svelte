import type { VariantType } from "@/types/index.js";

export type MotionEventNames = "motionstart" | "motioncomplete";

export function motionEvent(name: MotionEventNames, target: VariantType, isExit?: boolean) {
	return new CustomEvent(name, { detail: { target, isExit } });
}
