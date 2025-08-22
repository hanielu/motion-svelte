import { isAnimationControls } from "../../animation/utils/is-animation-controls.js";
import type { MotionProps } from "../../motion/types.js";
import { isVariantLabel } from "./is-variant-label.js";
import { variantProps } from "./variant-props.js";

export function isControllingVariants(props: MotionProps) {
	return (
		isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name as keyof typeof props]))
	);
}

export function isVariantNode(props: MotionProps) {
	return Boolean(isControllingVariants(props) || props.variants);
}
