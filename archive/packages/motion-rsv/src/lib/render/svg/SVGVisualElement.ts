import { type AnyResolvedKeyframe, getDefaultValueType, MotionValue, transformProps } from "motion-dom";
import type { MotionProps, MotionStyle } from "../../motion/types.js";
import { createBox } from "../../projection/geometry/models.js";
import type { IProjectionNode } from "../../projection/node/types.js";
import { DOMVisualElement } from "../dom/DOMVisualElement.js";
import type { DOMVisualElementOptions } from "../dom/types.js";
import { camelToDash } from "../dom/utils/camel-to-dash.js";
import type { ResolvedValues } from "../types.js";
import { VisualElement } from "../VisualElement.js";
import type { SVGRenderState } from "./types.js";
import { buildSVGAttrs } from "./utils/build-attrs.js";
import { camelCaseAttributes } from "./utils/camel-case-attrs.js";
import { isSVGTag } from "./utils/is-svg-tag.js";
import { renderSVG } from "./utils/render.js";
import { scrapeMotionValuesFromProps } from "./utils/scrape-motion-values.js";

export class SVGVisualElement extends DOMVisualElement<SVGElement, SVGRenderState, DOMVisualElementOptions> {
	type = "svg";

	isSVGTag = false;

	getBaseTargetFromProps(props: MotionProps, key: string): AnyResolvedKeyframe | MotionValue<any> | undefined {
		return props[key as keyof MotionProps];
	}

	readValueFromInstance(instance: SVGElement, key: string) {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		}
		key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
		return instance.getAttribute(key);
	}

	measureInstanceViewportBox = createBox;

	scrapeMotionValuesFromProps(props: MotionProps, prevProps: MotionProps, visualElement: VisualElement) {
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}

	build(renderState: SVGRenderState, latestValues: ResolvedValues, props: MotionProps) {
		buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
	}

	renderInstance(
		instance: SVGElement,
		renderState: SVGRenderState,
		styleProp?: MotionStyle | undefined,
		projection?: IProjectionNode<unknown> | undefined
	): void {
		renderSVG(instance, renderState, styleProp, projection);
	}

	mount(instance: SVGElement) {
		this.isSVGTag = isSVGTag(instance.tagName);
		super.mount(instance);
	}
}
