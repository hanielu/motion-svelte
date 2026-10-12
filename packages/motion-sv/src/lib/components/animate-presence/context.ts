import { Context } from "#lib/vendor/runed/index.js";
import type { MotionState } from "#lib/state/motion-state.js";

export interface PresenceManager {
	trackPosition?: (state: MotionState) => void;
	untrackPosition?: (state: MotionState) => void;
	isWaitBlocked?: () => boolean;
	onIntroStart?: (el: Element) => void;
	onOutroStart?: (el: Element) => void;
	onOutroBegin?: (el: Element) => void;
	onOutroEnd?: (el: Element) => void;
}

export const PresenceManagerContext = new Context<PresenceManager>("PresenceManagerContext", {});
