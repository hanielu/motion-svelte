import { Context } from "runed";
import type { MotionState } from "@/state/motion-state.js";

export interface PopLayoutControls {
	addPopStyle?: (state: MotionState) => void;
	removePopStyle?: (state: MotionState) => void;
	styles?: WeakMap<MotionState, HTMLStyleElement>;
	notifyExitStart?: (el: Element) => void;
	notifyExitEnd?: (el: Element) => void;
}

export const PopLayoutContext = new Context<PopLayoutControls>("PopLayoutContext", {});
