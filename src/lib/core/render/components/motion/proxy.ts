import { createMotionProxy } from "../create-proxy.js";
import { featureBundle } from "./feature-bundle.js";
import { createDomVisualElement } from "../../dom/create-visual-element.js";

export const motion = createMotionProxy(featureBundle, createDomVisualElement);
