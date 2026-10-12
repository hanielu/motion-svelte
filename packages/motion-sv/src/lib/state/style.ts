import { buildHTMLStyles, buildSVGAttrs, camelCaseAttributes, isSVGTag } from "motion-dom";
import type { HTMLRenderState, ResolvedValues, SVGRenderState } from "motion-dom";
import type { MotionStyleProps } from "#lib/types/state.js";

function camelToDash(str: string) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}

function createHTMLRenderState(): HTMLRenderState {
	return {
		transform: {},
		transformOrigin: {},
		style: {},
		vars: {},
	};
}

function createSVGRenderState(): SVGRenderState {
	return {
		...createHTMLRenderState(),
		attrs: {},
	};
}

/** The inline style motion would render for these values, or null when there is none. */
export function createStyles(latestValues: ResolvedValues) {
	const state = createHTMLRenderState();
	buildHTMLStyles(state, latestValues);
	const result: ResolvedValues = { ...state.style, ...state.vars };
	return Object.keys(result).length === 0 ? null : result;
}

/** The attributes and inline style motion would render for these values on an SVG element. */
export function createSVGStyles(latestValues: ResolvedValues, tag: string, styleProp?: MotionStyleProps) {
	const state = createSVGRenderState();
	buildSVGAttrs(state, latestValues, isSVGTag(tag), undefined, styleProp);
	// Convert camelCase attr keys to dash-case for SVG (matching renderSVG behavior)
	const attrs: ResolvedValues = {};
	for (const key in state.attrs) {
		const attrKey = camelCaseAttributes.has(key) ? key : camelToDash(key);
		attrs[attrKey] = state.attrs[key];
	}
	return { attrs, style: { ...state.style, ...state.vars } };
}
