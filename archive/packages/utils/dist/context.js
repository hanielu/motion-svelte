import { getContext, hasContext, setContext } from "svelte";
import { read } from "./box.svelte.js";
export class Context {
    #name;
    #key;
    #fallback;
    /**
     * @param name The name of the context.
     * This is used for generating the context key and error messages.
     * @param fallback Optional fallback value to return when context doesn't exist.
     */
    constructor(name, fallback) {
        this.#name = name;
        this.#key = Symbol(name);
        this.#fallback = fallback;
    }
    /**
     * The key used to get and set the context.
     *
     * It is not recommended to use this value directly.
     * Instead, use the methods provided by this class.
     */
    get key() {
        return this.#key;
    }
    /**
     * Checks whether this has been set in the context of a parent component.
     *
     * Must be called during component initialisation.
     */
    exists() {
        return hasContext(this.#key);
    }
    /**
     * Retrieves the context that belongs to the closest parent component.
     *
     * Must be called during component initialisation.
     *
     * @throws An error if the context does not exist.
     */
    get() {
        const context = getContext(this.#key);
        if (context === undefined) {
            throw new Error(`Context "${this.#name}" not found`);
        }
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component,
     * or the given fallback value if the context does not exist.
     *
     * Must be called during component initialisation.
     */
    getOr(fallback) {
        const context = getContext(this.#key);
        if (context === undefined) {
            return (fallback ?? this.#fallback);
        }
        return context;
    }
    /**
     * Associates the given value with the current component and returns it.
     *
     * Must be called during component initialisation.
     */
    set(context) {
        return setContext(this.#key, context);
    }
    // ── Box Utilities ─────────────────────────
    /**
     * Creates a Context for ReadableBox values with a simpler API.
     *
     * @param name The name of the context
     * @param fallback Optional fallback value (not a function)
     */
    static boxed(name, fallback) {
        const fallbackBox = fallback !== undefined ? read(() => fallback) : undefined;
        return new Context(name, fallbackBox);
    }
    // Convenience methods for ReadableBox contexts (use type assertion when calling)
    /**
     * For ReadableBox contexts: gets the current value directly.
     * Equivalent to this.get().current for ReadableBox<T> contexts.
     *
     * Must be called during component initialisation.
     *
     * Note: Only use this method if TContext is ReadableBox<T>
     */
    get current() {
        return this.getOr().current;
    }
    /**
     * For ReadableBox contexts: sets a value using a getter function.
     * Equivalent to this.set(box.with(getter)) for ReadableBox<T> contexts.
     *
     * Must be called during component initialisation.
     *
     * Note: Only use this method if TContext is ReadableBox<T>
     */
    setWith(getter) {
        const boxedValue = read(getter);
        return this.set(boxedValue);
    }
}
