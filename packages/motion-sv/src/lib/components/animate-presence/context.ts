import { Context } from "#lib/vendor/runed/index.js";
import type { MotionState } from "#lib/state/motion-state.js";

export interface PresenceManager {
	trackPosition?: (state: MotionState) => void;
	untrackPosition?: (state: MotionState) => void;
	isWaitBlocked?: () => boolean;
	/** Subscribe to be notified when a blocking exit starts. Callback receives the exiting element. */
	subscribeToExitStart?: (callback: (exitingEl: Element) => void) => () => void;
	onIntroStart?: (el: Element) => void;
	onOutroStart?: (el: Element) => void;
	onOutroEnd?: (el: Element) => void;
}

export const PresenceManagerContext = new Context<PresenceManager>("PresenceManagerContext", {});
