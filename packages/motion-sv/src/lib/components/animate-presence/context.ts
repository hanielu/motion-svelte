import type { MotionState } from "#lib/state/motion-state.js";
import { createOptionalContext } from "#lib/utils/optional-context.js";

/** How AnimatePresence holds its motion children while they exit. */
export interface PresenceManager {
	trackPosition: (state: MotionState) => void;
	untrackPosition: (state: MotionState) => void;
	isWaitBlocked: () => boolean;
	onIntroStart: (el: Element) => void;
	/** Returns whether the element is held until its exit completes. */
	onOutroStart: (el: Element) => boolean;
	onOutroBegin: (el: Element) => void;
	onOutroEnd: (el: Element) => void;
}

export const [getPresenceManager, setPresenceManager] = createOptionalContext<PresenceManager>();
