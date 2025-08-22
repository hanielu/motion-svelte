import type { VisualElement } from "../render/VisualElement.js";

// Fixes https://github.com/motiondivision/motion/issues/2270
export const getContextWindow = ({ current }: VisualElement<Element>) => {
  return current ? current.ownerDocument.defaultView : null;
};
