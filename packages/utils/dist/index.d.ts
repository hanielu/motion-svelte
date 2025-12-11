export * from "./box.svelte.js";
export * from "./watch.svelte.js";
export * from "./is.js";
export * from "./context.js";
export * from "./types.js";
export * from "./extract.js";
export * from "./attach-ref.js";
export * from "./unbox.js";
export * from "./previous.svelte.js";
export * from "./is-mounted.svelte.js";
export * from "./vue-reactivity/index.js";
export * from "./rala-log.js";
export declare const isDef: <T = any>(val?: T) => val is T;
/**
 * Converts a style object into a CSS string.
 *
 * - Filters out properties with `undefined` values.
 * - Converts camelCase keys into kebab-case.
 * - Appends `px` to numeric values unless the property is unitless.
 *
 * @param {Record<string, string | number | undefined>} styleObj -
 * An object where keys are CSS property names in camelCase and values are
 * strings, numbers, or `undefined`.
 *
 * @returns {string} A CSS string suitable for inline styles or style attributes.
 *
 * @example
 * css({ backgroundColor: "red", width: 100, opacity: 0.5 })
 * // "background-color:red;width:100px;opacity:0.5"
 */
export declare function css(styleObj: Record<string, string | number | undefined>): string;
/**
 * Returns a new object that copies all properties from the given object `props`
 * and adds (or overwrites) a property with the specified `key` and `value`.
 *
 * @template T - Type of the original object.
 * @template K - Type of the property key to add.
 * @template V - Type of the property value to add.
 *
 * @param {T} props - The source object whose properties should be copied.
 * @param {K} key - The property key to add or overwrite.
 * @param {V} value - The value to associate with the given key.
 * @returns {T & Record<K, V>} A new object with all original properties from `props`
 * and the additional property `[key]: value`.
 */
export declare function withProp<T extends object, K extends PropertyKey, V>(props: T, key: K, value: V): T & Record<K, V>;
/**
 * Returns a new object that copies all properties from the given object `props`
 * and adds (or overwrites) properties from the `extras` object.
 *
 * @template T - Type of the original object.
 * @template E - Type of the extra properties to add.
 *
 * @param {T} props - The source object whose properties should be copied.
 * @param {E} extras - An object containing additional properties to merge into the result.
 * @returns {T & E} A new object with all original properties from `props`
 * and all properties from `extras`.
 */
export declare function withProps<T extends object, E extends object>(props: T, extras: E): T & E;
//# sourceMappingURL=index.d.ts.map