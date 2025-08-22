import type { Component } from "svelte";
import type { MotionProps } from "../../motion/types.js";
import { copyRawValuesOnly } from "../html/use-props.svelte.js";
import type { ResolvedValues } from "../types.js";
import { buildSVGAttrs } from "./utils/build-attrs.js";
import { createSvgRenderState } from "./utils/create-render-state.js";
import { isSVGTag } from "./utils/is-svg-tag.js";
import { read, type ReadableBox } from "runed";
import { toStyleString } from "../html/utils/style-string.js";

export function useSVGProps(
	props: ReadableBox<MotionProps>,
	visualState: ReadableBox<ResolvedValues>,
	_isStatic: boolean,
	Component: string | Component<Record<string, any>>
) {
	const visualProps = $derived.by(() => {
		const state = createSvgRenderState();

		buildSVGAttrs(
			state,
			visualState.current,
			isSVGTag(Component),
			props.current.transformTemplate,
			props.current.style
		);

		return {
			...state.attrs,
			style: { ...state.style },
		};
	});

	// TODO: (haniel) maybe we need to wrap these in a $derived as well?
	if (props.current.style && typeof props.current.style === "object") {
		const rawStyles: Record<string, unknown> = {};
		copyRawValuesOnly(rawStyles as any, props.current.style as any, props.current);
		visualProps.style = { ...rawStyles, ...(visualProps.style as any) } as any;
	}

	// Serialize to string and merge with any user-provided string style
	const baseStyleString = typeof props.current.style === "string" ? (props.current.style as string) : "";
	const computedStyleString = toStyleString(visualProps.style as any);
	(visualProps.style as any) = baseStyleString
		? baseStyleString.replace(/;\s*$/u, "") + ";" + computedStyleString
		: computedStyleString;

	return read(() => visualProps);
}
