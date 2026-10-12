import type { MotionState } from "#lib/state/motion-state.js";

export type FeatureKey =
	"animation" | "projection" | "layout" | "hover" | "press" | "focus" | "drag" | "pan" | "inView";

export class Feature {
	static key: FeatureKey;
	/**
	 * Props that enable this feature, as in upstream's feature definitions. A component only gets the feature once
	 * one of them is set (and keeps it after that). Features without any are always enabled.
	 */
	static enabledBy?: readonly string[];

	isMount: boolean;

	state: MotionState;

	constructor(state: MotionState) {
		this.state = state;
	}

	mount() {}

	unmount() {}

	update() {}
}
