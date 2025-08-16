import type { VisualElement } from "../../render/VisualElement.js";
import { Context } from "runed";

export interface MotionContextProps<Instance = unknown> {
  visualElement?: VisualElement<Instance>;
  initial?: false | string | string[];
  animate?: string | string[];
}

export const MotionContext = /* @__PURE__ */ Context.boxed<MotionContextProps>("MotionContext", {});
