import type { AsTag, MotionStateContext, Options, VariantType } from "#lib/types/index.js";
import type { PresenceContext } from "#lib/components/animate-presence/presence.svelte.js";
import type { ResolvedValues } from "motion-dom";

/** Resolve a variant definition to its full target, including `transition`. */
function resolveVariantValue(
	definition?: Options["initial"] | Options["animate"],
	variants?: Options["variants"],
	custom?: Options["custom"]
): VariantType | undefined {
	if (Array.isArray(definition)) {
		return definition.reduce((acc, item) => {
			const resolvedVariant = resolveVariantValue(item, variants, custom);
			return resolvedVariant ? { ...acc, ...resolvedVariant } : acc;
		}, {});
	} else if (typeof definition === "object") {
		return definition as VariantType;
	} else if (definition && variants) {
		const variant = variants[definition as string];
		return (typeof variant === "function" ? variant(custom, {}, {}) : variant) as VariantType;
	}
}

export function resolveVariant(
	definition?: Options["initial"] | Options["animate"],
	variants?: Options["variants"],
	custom?: Options["custom"]
): VariantType | undefined {
	const resolved = resolveVariantValue(definition, variants, custom);
	if (!resolved) return undefined;
	const { transition, transitionEnd, ...target } = resolved as VariantType & { transitionEnd?: ResolvedValues };
	return { ...target, ...transitionEnd };
}

/**
 * Resolve initial latest values from variant sources.
 * Shared by MotionState constructor and SSR style resolution.
 *
 * @param options - Motion options
 * @param context - Optional parent context for variant inheritance (MotionState passes this)
 */
export function resolveInitialValues(
	options: Options & { presenceContext?: PresenceContext },
	context?: MotionStateContext
): VariantType {
	const initial = options.initial === undefined && options.variants ? context?.initial : options.initial;
	const sources = initial === false ? (["initial", "animate"] as const) : (["initial"] as const);
	const custom = options.custom ?? options.presenceContext?.custom;
	return sources.reduce<VariantType>((acc, variant) => {
		return {
			...acc,
			...resolveVariant(options[variant] || context?.[variant], options.variants, custom),
		};
	}, {});
}

export function isCssVar(name: string) {
	return name?.startsWith("--");
}

export const svgElements = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"svg",
	"switch",
	"symbol",
	"text",
	"tspan",
	"use",
	"view",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"linearGradient",
	"radialGradient",
	"textPath",
] as const;
type UnionStringArray<T extends Readonly<string[]>> = T[number];
export type SVGElements = UnionStringArray<typeof svgElements>;

const svgElementSet = new Set(svgElements);
export function isSVGElement(as: AsTag): as is SVGElements {
	return svgElementSet.has(as as SVGElements);
}
