import { makeUseVisualState } from "../../motion/utils/use-visual-state.js";
import { createHtmlRenderState } from "./utils/create-render-state.js";
import { scrapeMotionValuesFromProps } from "./utils/scrape-motion-values.js";

export const useHTMLVisualState = /*@__PURE__*/ makeUseVisualState({
	scrapeMotionValuesFromProps,
	createRenderState: createHtmlRenderState,
});
