import type { MotionState } from "#lib/state/index.js";
import type { NodeGroup } from "motion-dom";
import { createOptionalContext } from "#lib/utils/optional-context.js";

export type { NodeGroup };
export interface LayoutGroupState {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: () => number;
}

/** The closest motion component, whose variants its motion descendants inherit. */
export const [getParentMotionState, setParentMotionState] = createOptionalContext<MotionState>();

export const [getLayoutGroup, setLayoutGroup] = createOptionalContext<LayoutGroupState>();
