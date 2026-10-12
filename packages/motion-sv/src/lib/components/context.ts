import type { MotionState } from "#lib/state/index.js";
import type { NodeGroup } from "motion-dom";
import { Context } from "#lib/vendor/runed/index.js";
import type { FnGetter } from "#lib/types/common.js";

export const MotionStateContext = new Context<MotionState>("MotionState");

export type { NodeGroup };
export interface LayoutGroupState {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: FnGetter<number>;
}

export const LayoutGroupContext = new Context<LayoutGroupState>("LayoutGroup");
