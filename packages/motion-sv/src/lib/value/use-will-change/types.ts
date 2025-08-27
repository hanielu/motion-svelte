import type { MotionValue } from "framer-motion/types";

export interface WillChange extends MotionValue {
	add: (name: string) => void;
}
