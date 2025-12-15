import type { MotionState } from "@/state/index.js";
import type { IProjectionNode } from "framer-motion";
import { Context } from "runed";
import type { FnGetter } from "@/types/common.js";

export const MotionStateContext = new Context<MotionState>("MotionState");

export interface NodeGroup {
	add: (node: IProjectionNode) => void;
	remove: (node: IProjectionNode) => void;
	dirty: VoidFunction;
}
export interface LayoutGroupState {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: FnGetter<number>;
}

export const LayoutGroupContext = new Context<LayoutGroupState>("LayoutGroup");
