import type { Box } from "framer-motion";
import { Context } from "runed";
import type { Mutable } from "@/types/common.js";

export interface ReorderContextProps<T> {
	axis?: Mutable<"x" | "y">;
	registerItem?: (item: T, layout: Box) => void;
	updateOrder?: (item: T, offset: number, velocity: number) => void;
}

export const ReorderContext = new Context<ReorderContextProps<any>>("ReorderContext");
