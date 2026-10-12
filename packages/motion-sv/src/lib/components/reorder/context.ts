import type { Box, Point } from "motion-utils";
import { Context } from "#lib/vendor/runed/index.js";
import type { ReorderAxis } from "./types.js";
import type { LayoutMotionNamespace } from "../motion/layout-motion.svelte";

export interface ReorderContextProps<T> {
	readonly axis: ReorderAxis;
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: Point, velocity: Point) => void;
	/** The group's DOM element, used for drag auto-scroll and text direction */
	groupRef: () => Element | null | undefined;
	/** The items' layout scope, snapshotted before each reorder so the items animate to their new slots */
	layoutMotion: LayoutMotionNamespace;
}

export const ReorderContext = new Context<ReorderContextProps<any>>("ReorderContext");
