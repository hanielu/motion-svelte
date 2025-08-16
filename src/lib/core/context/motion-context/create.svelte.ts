import { box, type ReadableBox } from "runed";
import type { MotionProps } from "../../motion/types.js";
import { type MotionContextProps, MotionContext } from "./index.js";
import { getCurrentTreeVariants } from "./utils.js";

export function useCreateMotionContext<Instance>(
  props: ReadableBox<MotionProps>
): ReadableBox<MotionContextProps<Instance>> {
  // Capture the parent context box BEFORE setting a new context on this component.
  // This avoids self-referential reads where the derived value would read from itself.
  const parentContextBox = MotionContext.get();
  const { initial, animate } = $derived(
    getCurrentTreeVariants(props.current, parentContextBox.current)
  );

  const obj = box({
    get initial() {
      return initial;
    },
    get animate() {
      return animate;
    },
  });

  return obj;
}
