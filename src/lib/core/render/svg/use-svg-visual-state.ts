import { makeUseVisualState } from "../../motion/utils/use-visual-state.svelte.js";
import { createSvgRenderState } from "./utils/create-render-state.js";
import { scrapeMotionValuesFromProps as scrapeSVGProps } from "./utils/scrape-motion-values.js";

export const useSVGVisualState = /*@__PURE__*/ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeSVGProps,
  createRenderState: createSvgRenderState,
});
