import type { TargetAndTransition, VariantLabels } from "motion-dom";

export type FocusProps = {
	/**
	 * Variant to apply when the element is focused.
	 */
	whileFocus?: VariantLabels | TargetAndTransition;
};
