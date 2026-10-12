import type { EventInfo, TargetAndTransition, VariantLabels } from "motion-dom";

export type HoverEvent = (event: MouseEvent, info: EventInfo) => void;

export interface HoverProps {
	/**
	 * Variant to apply when the element is hovered.
	 */
	whileHover?: VariantLabels | TargetAndTransition;
	onHoverStart?: HoverEvent;
	onHoverEnd?: HoverEvent;
}
