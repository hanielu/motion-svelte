import { createHtmlRenderState } from "../../html/utils/create-render-state.js";
import type { SVGRenderState } from "../types.js";

export const createSvgRenderState = (): SVGRenderState => ({
  ...createHtmlRenderState(),
  attrs: {},
});
