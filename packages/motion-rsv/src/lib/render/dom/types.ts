import type { HTMLMotionComponents } from "../html/types.js";
import type { SVGMotionComponents } from "../svg/types.js";

export interface DOMVisualElementOptions {
  /**
   * If `true`, this element will be included in the projection tree.
   *
   * Default: `true`
   *
   * @public
   */
  allowProjection?: boolean;

  /**
   * Allow this element to be GPU-accelerated. We currently enable this by
   * adding a `translateZ(0)`.
   *
   * @public
   */
  enableHardwareAcceleration?: boolean;
}

export type DOMMotionComponents = HTMLMotionComponents & SVGMotionComponents;
