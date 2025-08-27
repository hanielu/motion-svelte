import type { MotionState } from "@/state/index.js";
import type { IProjectionNode } from "framer-motion/types";
import { Context, type Ref } from "runed";

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
	key?: Ref<number>;
}

export const LayoutGroupContext = new Context<LayoutGroupState>("LayoutGroup");
