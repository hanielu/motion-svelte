import type { MotionContextProps } from "./index.js";
import type { MotionProps } from "../../motion/types.js";
import { isControllingVariants } from "../../render/utils/is-controlling-variants.js";
import { isVariantLabel } from "../../render/utils/is-variant-label.js";

export function getCurrentTreeVariants(
  props: MotionProps,
  context: MotionContextProps
): MotionContextProps {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? (initial as any) : undefined,
      animate: isVariantLabel(animate) ? animate : undefined,
    };
  }
  return props.inherit !== false ? context : {};
}
