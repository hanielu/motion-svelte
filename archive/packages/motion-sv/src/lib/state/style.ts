import { buildHTMLStyles, buildSVGAttrs, camelCaseAttributes, isSVGTag } from "motion-dom";
import type { HTMLRenderState, SVGRenderState } from "motion-dom";
import { isCssVar } from "./utils.js";

function camelToDash(str: string) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}

type MotionStyleKey = Exclude<keyof CSSStyleDeclaration, "length" | "parentRule">;

/**
 * Read/write computed styles from an element.
 * Retained for the Svelte exit-transition duration estimator.
 */
export const style = {
	get: (element: Element, name: string): string | undefined => {
		const value = isCssVar(name)
			? (element as HTMLElement).style.getPropertyValue(name)
			: getComputedStyle(element)[name as MotionStyleKey];
		return value as string | undefined;
	},
	set: (element: Element, name: string, value: string | number) => {
		if (isCssVar(name)) {
			(element as HTMLElement).style.setProperty(name, value as string);
		} else {
			(element as HTMLElement).style[name as MotionStyleKey] = value as any;
		}
	},
};

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

export function createStyles(latestValues: Record<string, any>): Record<string, any> | null {
	const state = createHTMLRenderState();
	buildHTMLStyles(state, latestValues);
	const result: Record<string, any> = { ...state.style };
	for (const key in state.vars) {
		result[key] = state.vars[key];
	}
	if (Object.keys(result).length === 0) {
		return null;
	}
	return result;
}

export function createSVGStyles(
	latestValues: Record<string, any>,
	tag: string,
	styleProp?: Record<string, any>
): { attrs: Record<string, any>; style: Record<string, any> } {
	const state = createSVGRenderState();
	buildSVGAttrs(state, latestValues, isSVGTag(tag), undefined, styleProp);
	// Convert camelCase attr keys to dash-case for SVG (matching renderSVG behavior)
	const attrs: Record<string, any> = {};
	for (const key in state.attrs) {
		const attrKey = camelCaseAttributes.has(key) ? key : camelToDash(key);
		attrs[attrKey] = state.attrs[key];
	}
	return {
		attrs,
		style: { ...state.style, ...state.vars } as Record<string, any>,
	};
}
