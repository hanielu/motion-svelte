import { camelToDash } from "../../dom/utils/camel-to-dash.js";

// A minimal list of unitless CSS properties (React-style)
// Add here as we encounter more. Most numeric values should default to px.
const unitlessProperties = new Set<string>([
	"opacity",
	"zIndex",
	"fontWeight",
	"lineHeight",
	"zoom",
	"flexGrow",
	"flexShrink",
	"order",
	"orphans",
	"widows",
	"tabSize",
	"gridRow",
	"gridColumn",
	// SVG-related unitless values
	"strokeMiterlimit",
	"fillOpacity",
	"strokeOpacity",
	"shapeImageThreshold",
]);

function isCssVariable(propertyName: string): boolean {
	return propertyName.startsWith("--");
}

function shouldAppendPx(propertyName: string, value: unknown): boolean {
	if (value == null) return false;
	if (typeof value !== "number") return false;
	if (Number.isNaN(value)) return false;
	if (isCssVariable(propertyName)) return false;
	return !unitlessProperties.has(propertyName);
}

export function toStyleString(style: Record<string, unknown> | string | undefined | null): string {
	if (style == null) return "";
	if (typeof style === "string") return style;

	let css = "";
	for (const key in style) {
		const value = (style as Record<string, unknown>)[key];
		if (value == null || value === false) continue;

		const property = isCssVariable(key) ? key : camelToDash(key);
		const serialized = shouldAppendPx(key, value) ? `${value}px` : String(value);
		css += `${property}: ${serialized};`;
	}

	return css;
}
