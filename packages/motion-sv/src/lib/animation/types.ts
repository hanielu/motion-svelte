import type { MotionState } from "#lib/state/index.js";
import type { DOMKeyframesDefinition } from "motion-dom";

export interface MotionExitDefinition extends DOMKeyframesDefinition {
	transition?: {
		duration?: number;
		delay?: number;
		ease?: any;
	};
}

export interface MotionTransitionParamsShape {
	definition: MotionExitDefinition | undefined;
	state: MotionState;
}
