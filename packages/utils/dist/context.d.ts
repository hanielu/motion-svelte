import { type ReadableBox } from "./box.svelte.js";
type UnboxedType<T> = T extends ReadableBox<infer U> ? U : never;
export declare class Context<TContext> {
    #private;
    /**
     * @param name The name of the context.
     * This is used for generating the context key and error messages.
     * @param fallback Optional fallback value to return when context doesn't exist.
     */
    constructor(name: string, fallback?: TContext);
    /**
     * The key used to get and set the context.
     *
     * It is not recommended to use this value directly.
     * Instead, use the methods provided by this class.
     */
    get key(): symbol;
    /**
     * Checks whether this has been set in the context of a parent component.
     *
     * Must be called during component initialisation.
     */
    exists(): boolean;
    /**
     * Retrieves the context that belongs to the closest parent component.
     *
     * Must be called during component initialisation.
     *
     * @throws An error if the context does not exist.
     */
    get(): TContext;
    /**
     * Retrieves the context that belongs to the closest parent component,
     * or the given fallback value if the context does not exist.
     *
     * Must be called during component initialisation.
     */
    getOr<TFallback extends TContext | null | undefined = TContext>(fallback?: TFallback): (TContext & ({} | null)) | (TFallback extends null ? TContext | null : TContext);
    /**
     * Associates the given value with the current component and returns it.
     *
     * Must be called during component initialisation.
     */
    set(context: TContext): TContext;
    /**
     * Creates a Context for ReadableBox values with a simpler API.
     *
     * @param name The name of the context
     * @param fallback Optional fallback value (not a function)
     */
    static boxed<T>(name: string, fallback?: T): Context<ReadableBox<T>>;
    /**
     * For ReadableBox contexts: gets the current value directly.
     * Equivalent to this.get().current for ReadableBox<T> contexts.
     *
     * Must be called during component initialisation.
     *
     * Note: Only use this method if TContext is ReadableBox<T>
     */
    get current(): UnboxedType<TContext>;
    /**
     * For ReadableBox contexts: sets a value using a getter function.
     * Equivalent to this.set(box.with(getter)) for ReadableBox<T> contexts.
     *
     * Must be called during component initialisation.
     *
     * Note: Only use this method if TContext is ReadableBox<T>
     */
    setWith(getter: () => UnboxedType<TContext>): TContext;
}
export {};
//# sourceMappingURL=context.d.ts.map