import type { TransformPoint } from "motion-utils";
import { convertBoundingBoxToBox, transformBoxPoints } from "../geometry/conversion.js";
import { translateAxis } from "../geometry/delta-apply.js";
import { nextSeq } from "$lib/utils/debug-seq.js";
import type { IProjectionNode } from "../node/types.js";

export function measureViewportBox(instance: HTMLElement, transformPoint?: TransformPoint) {
  const rect = instance.getBoundingClientRect();
  const converted = convertBoundingBoxToBox(transformBoxPoints(rect, transformPoint));
  try {
    console.log(
      "[haniel][",
      nextSeq(),
      "][measureViewportBox] tag=",
      instance.tagName,
      "rect=",
      { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      "converted=",
      { x: converted.x, y: converted.y }
    );
  } catch {}
  return converted;
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
