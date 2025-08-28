import type { Box } from "framer-motion";
import { Context, type WritableComputedRef } from "runed";

export interface ReorderContextProps<T> {
	axis?: WritableComputedRef<"x" | "y">;
	registerItem?: (item: T, layout: Box) => void;
	updateOrder?: (item: T, offset: number, velocity: number) => void;
}

export const ReorderContext = new Context<ReorderContextProps<any>>("ReorderContext");
