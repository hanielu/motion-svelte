import type { TargetAndTransition, VariantLabels } from "motion-dom";

export type FocusProps = {
	/**
	 * @deprecated Use `whileFocus` instead.
	 */
	focus?: VariantLabels | TargetAndTransition;
	/**
	 * Variant to apply when the element is focused.
	 */
	whileFocus?: VariantLabels | TargetAndTransition;
	onFocus?: (e: FocusEvent) => void;
	onBlur?: (e: FocusEvent) => void;
};
