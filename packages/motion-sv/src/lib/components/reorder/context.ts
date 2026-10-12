import type { Box, Point } from "motion-utils";
import { Context } from "#lib/vendor/runed/index.js";
import type { ReorderAxis } from "./types.js";

export interface ReorderContextProps<T> {
	readonly axis: ReorderAxis;
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: Point, velocity: Point) => void;
	/** The group's DOM element, used for drag auto-scroll and text direction */
	groupRef: () => Element | null | undefined;
}

export const ReorderContext = new Context<ReorderContextProps<any>>("ReorderContext");
