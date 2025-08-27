import type { Axis } from "framer-motion/types";

export function calcLength(axis: Axis) {
	return axis.max - axis.min;
}
