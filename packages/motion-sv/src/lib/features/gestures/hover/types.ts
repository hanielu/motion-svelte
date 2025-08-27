import type { EventInfo } from "framer-motion/types";
import type { TargetAndTransition, VariantLabels } from "motion-dom";

export type HoverEvent = (event: MouseEvent, info: EventInfo) => void;

export interface HoverProps {
	/**
	 * @deprecated Use `whileHover` instead.
	 */
	// hover?: VariantLabels | TargetAndTransition;
	/**
	 * Variant to apply when the element is hovered.
	 */
	whileHover?: VariantLabels | TargetAndTransition;
	onHoverStart?: HoverEvent;
	onHoverEnd?: HoverEvent;
}
