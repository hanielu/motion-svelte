import { createMotionProxy } from "../create-proxy.js";
import { featureBundle } from "./feature-bundle.js";
import { createDomVisualElement } from "../../dom/create-visual-element.js";
export { createLayoutMotion, type LayoutMotionNamespace } from "../../../motion/features/layout/layout-motion.svelte";

export const motion = createMotionProxy(featureBundle, createDomVisualElement);
