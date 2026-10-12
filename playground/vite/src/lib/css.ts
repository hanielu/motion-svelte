const UNITLESS = ["opacity", "zIndex", "fontWeight", "lineHeight", "order", "flexGrow", "flexShrink"];

/**
 * Serializes a React-style style object for a plain element's `style` attribute; numbers get `px` unless unitless.
 *
 * @example css({ backgroundColor: "red", width: 100, opacity: 0.5 }) // "background-color:red;width:100px;opacity:0.5"
 */
export function css(styleObj: Record<string, string | number | undefined>) {
	return Object.entries(styleObj)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => {
			const formattedValue = typeof value === "number" && !UNITLESS.includes(key) ? `${value}px` : value;
			return `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${formattedValue}`;
		})
		.join(";");
}
