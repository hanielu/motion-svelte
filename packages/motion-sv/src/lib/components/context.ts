import type { MotionState } from "@/state/index.js";
import type { NodeGroup } from "motion-dom";
import { Context } from "runed";
import type { FnGetter } from "@/types/common.js";

export const MotionStateContext = new Context<MotionState>("MotionState");

export type { NodeGroup };
export interface LayoutGroupState {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: FnGetter<number>;
}

export const LayoutGroupContext = new Context<LayoutGroupState>("LayoutGroup");
