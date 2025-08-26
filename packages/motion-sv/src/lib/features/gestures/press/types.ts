import type { EventInfo } from "framer-motion";
import type { TargetAndTransition, VariantLabels } from "motion-dom";

export type PressEvent = (event: PointerEvent, info: EventInfo) => void;

export interface PressProps {
	/**
	 * If `true`, the press gesture will attach its start listener to window.
	 */
	globalPressTarget?: boolean;
	/**
	 * @deprecated Use `whilePress` instead.
	 */
	// press?: VariantLabels | TargetAndTransition;
	/**
	 * Variant to apply when the element is pressed.
	 */
	whilePress?: VariantLabels | TargetAndTransition;
	onPressStart?: PressEvent;
	onPress?: PressEvent;
	onPressCancel?: PressEvent;
}
