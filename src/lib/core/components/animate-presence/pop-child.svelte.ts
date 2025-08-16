import { MotionConfigContext } from "../../context/motion-config-context.js";
import type { ReadableBox } from "runed";
import type { PresenceContextProps } from "../../context/presence-context.js";

export function createPopLayout(
  el: HTMLElement,
  presenceBox: ReadableBox<PresenceContextProps | null>,
  opts?: { anchorX?: "left" | "right"; root?: HTMLElement | ShadowRoot }
) {
  const { nonce } = MotionConfigContext.current;
  let styleEl: HTMLStyleElement | null = null;
  let id = "";
  let prev = true;

  function cleanup() {
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    styleEl = null;
    if (el.dataset.motionPopId === id) delete (el.dataset as any).motionPopId;
  }

  $effect(() => {
    const presence = presenceBox.current;
    if (!presence) return;
    const now = presence.isPresent;
    if (!el) return;

    if (prev && !now) {
      const parent = el.offsetParent as HTMLElement | null;
      const parentWidth = parent?.offsetWidth ?? 0;

      const width = el.offsetWidth || 0;
      const height = el.offsetHeight || 0;
      const top = el.offsetTop;
      const left = el.offsetLeft;
      const right = parentWidth - width - left;

      id = presence.id;
      el.dataset.motionPopId = id;

      const style = document.createElement("style");
      if (nonce) style.nonce = nonce;
      const parentNode = (opts?.root ?? document.head) as HTMLElement;
      parentNode.appendChild(style);
      styleEl = style;

      const xRule = (opts?.anchorX ?? "left") === "left" ? `left: ${left}px` : `right: ${right}px`;

      style.sheet?.insertRule(
        `[data-motion-pop-id="${id}"]{position:absolute !important;width:${width}px !important;height:${height}px !important;${xRule} !important;top:${top}px !important;}`
      );
    } else if (now && !prev) {
      cleanup();
    }

    prev = now;
  });

  $effect(() => () => cleanup());
}
