import type { Box } from "motion-utils";
import { Context } from "runed";
import type { Mutable } from "@/types/common.js";

export interface ReorderContextProps<T> {
	axis?: Mutable<"x" | "y">;
	registerItem?: (item: T, layout: Box) => void;
	updateOrder?: (item: T, offset: number, velocity: number) => void;
	/** Getter for the group's DOM element, used for drag auto-scroll */
	groupRef?: () => HTMLElement | SVGElement | null | undefined;
}

export const ReorderContext = new Context<ReorderContextProps<any>>("ReorderContext");
