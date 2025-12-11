import { Context } from "runed";
import type { MotionState } from "@/state/motion-state.js";

export interface PopLayoutControls {
	trackPosition?: (state: MotionState) => void;
	untrackPosition?: (state: MotionState) => void;
	isWaitBlocked?: () => boolean;
	exits?: { value: number };
	/** Subscribe to be notified when a blocking exit starts */
	subscribeToExitStart?: (callback: () => void) => () => void;
	onIntroStart?: (el: Element) => void;
	onOutroStart?: (el: Element) => void;
	onOutroEnd?: (el: Element) => void;
}

export const PopLayoutContext = new Context<PopLayoutControls>("PopLayoutContext", {});
