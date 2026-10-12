import type { Box, Point } from "motion-utils";
import type { ReorderAxis } from "./types.js";
import type { LayoutMotionNamespace } from "../motion/layout-motion.svelte";
import { createOptionalContext } from "#lib/utils/optional-context.js";

export interface ReorderContextProps<T> {
	readonly axis: ReorderAxis;
	registerItem(item: T, layout: Box): void;
	updateOrder(item: T, offset: Point, velocity: Point): void;
	/** The group's DOM element, used for drag auto-scroll and text direction */
	groupRef(): Element | null | undefined;
	/** The items' layout scope, snapshotted before each reorder so the items animate to their new slots */
	layoutMotion: LayoutMotionNamespace;
}

const [getOptionalReorderContext, setReorderContext] = createOptionalContext<ReorderContextProps<unknown>>();
export { setReorderContext };

/** The closest Reorder.Group's context. */
export function getReorderContext() {
	const context = getOptionalReorderContext();
	if (!context) throw new Error("Reorder.Item must be a child of Reorder.Group");
	return context;
}
