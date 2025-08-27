import { convertBoundingBoxToBox, transformBoxPoints } from "@/projection/conversion.js";
import { translateAxis } from "@/projection/geometry/delta-apply.js";
import type { IProjectionNode, TransformPoint } from "framer-motion/types";

export function measureViewportBox(instance: HTMLElement, transformPoint?: TransformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}

export function measurePageBox(
	element: HTMLElement,
	rootProjectionNode: IProjectionNode,
	transformPagePoint?: TransformPoint
) {
	const viewportBox = measureViewportBox(element, transformPagePoint);
	const { scroll } = rootProjectionNode;

	if (scroll) {
		translateAxis(viewportBox.x, scroll.offset.x);
		translateAxis(viewportBox.y, scroll.offset.y);
	}

	return viewportBox;
}
