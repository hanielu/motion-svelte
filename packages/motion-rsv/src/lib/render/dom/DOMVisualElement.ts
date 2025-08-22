import {
  type AnyResolvedKeyframe,
  DOMKeyframesResolver,
  isMotionValue,
  MotionValue,
} from "motion-dom";
import type { MotionProps, MotionStyle } from "../../motion/types.js";
import type { DOMVisualElementOptions } from "../dom/types.js";
import type { HTMLRenderState } from "../html/types.js";
import { VisualElement } from "../VisualElement.js";

export abstract class DOMVisualElement<
  Instance extends HTMLElement | SVGElement = HTMLElement,
  State extends HTMLRenderState = HTMLRenderState,
  Options extends DOMVisualElementOptions = DOMVisualElementOptions
> extends VisualElement<Instance, State, Options> {
  sortInstanceNodePosition(a: Instance, b: Instance): number {
    /**
     * compareDocumentPosition returns a bitmask, by using the bitwise &
     * we're returning true if 2 in that bitmask is set to true. 2 is set
     * to true if b preceeds a.
     */
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }

  getBaseTargetFromProps(
    props: MotionProps,
    key: string
  ): AnyResolvedKeyframe | MotionValue<any> | undefined {
    return props.style ? (props.style[key as keyof MotionStyle] as string) : undefined;
  }

  removeValueFromRenderState(key: string, { vars, style }: HTMLRenderState): void {
    delete vars[key];
    delete style[key];
  }

  KeyframeResolver = DOMKeyframesResolver;

  childSubscription?: VoidFunction;
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }

    // TODO: (haniel) this is probably not going to works as intended,
    // when testing out motion values as direct children of motion component
    // come back to this, we may need to use a different prop key specifically
    // for motion values
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", latest => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
