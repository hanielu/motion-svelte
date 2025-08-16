export * from "./box.svelte.js";
export * from "./watch.svelte.js";
export * from "./is.js";
export * from "./context.js";
export * from "./types.js";
export * from "./extract.js";
export * from "./attach-ref.js";
export * from "./unbox.js";
export * from "./previous.svelte.js";

export function styleToStr(styleObj: Record<string, string | number | undefined>) {
  return Object.entries(styleObj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      // Add 'px' to numbers except for unitless properties
      const unitlessProps = [
        "opacity",
        "zIndex",
        "fontWeight",
        "lineHeight",
        "order",
        "flexGrow",
        "flexShrink",
      ];
      const formattedValue =
        typeof value === "number" && !unitlessProps.includes(key) ? `${value}px` : value;
      return `${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${formattedValue}`;
    })
    .join(";");
}
