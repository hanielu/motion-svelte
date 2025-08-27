import type { VisualElement } from "framer-motion/types";

export function getContextWindow({ current }: VisualElement<Element>) {
	return current ? current.ownerDocument.defaultView : null;
}
