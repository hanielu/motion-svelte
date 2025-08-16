import { getContext, hasContext, setContext } from "svelte";
import { box, type ReadableBox } from "./box.svelte.js";

// Type utilities to reduce duplication
type UnboxedType<T> = T extends ReadableBox<infer U> ? U : never;

export class Context<TContext> {
  readonly #name: string;
  readonly #key: symbol;
  readonly #fallback?: TContext;

  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   * @param fallback Optional fallback value to return when context doesn't exist.
   */
  constructor(name: string, fallback?: TContext) {
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
  get key(): symbol {
    return this.#key;
  }

  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists(): boolean {
    return hasContext(this.#key);
  }

  /**
   * Retrieves the context that belongs to the closest parent component.
   * If a fallback was provided in the constructor and no context exists, returns the fallback.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist and no fallback was provided.
   */
  get(): TContext {
    const context: TContext | undefined = getContext(this.#key);
    if (context === undefined) {
      if (this.#fallback !== undefined) {
        return this.#fallback;
      }
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }

  /**
   * Retrieves the context that belongs to the closest parent component.
   * Always throws an error if the context does not exist, ignoring any fallback.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  getOrThrow(): TContext {
    const context: TContext | undefined = getContext(this.#key);
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
  getOr<TFallback>(fallback: TFallback): TContext | TFallback {
    const context: TContext | undefined = getContext(this.#key);
    if (context === undefined) {
      return fallback;
    }
    return context;
  }

  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context: TContext): TContext {
    return setContext(this.#key, context);
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
  get current(): UnboxedType<TContext> {
    return (this.get() as ReadableBox<UnboxedType<TContext>>).current;
  }

  /**
   * For ReadableBox contexts: sets a value using a getter function.
   * Equivalent to this.set(box.with(getter)) for ReadableBox<T> contexts.
   *
   * Must be called during component initialisation.
   *
   * Note: Only use this method if TContext is ReadableBox<T>
   */
  setWith(getter: () => UnboxedType<TContext>): TContext {
    const boxedValue = box.with(getter);
    return this.set(boxedValue as TContext);
  }

  /**
   * For ReadableBox contexts: sets a static value.
   * Equivalent to this.set(box(value)) for ReadableBox<T> contexts.
   *
   * Must be called during component initialisation.
   *
   * Note: Only use this method if TContext is ReadableBox<T>
   */
  setBoxed(value: UnboxedType<TContext>): TContext {
    const boxedValue = box(value);
    return this.set(boxedValue as TContext);
  }

  /**
   * Creates a Context for ReadableBox values with a simpler API.
   *
   * @param name The name of the context
   * @param fallback Optional fallback value (not a function)
   */
  static boxed<T>(name: string, fallback?: T): Context<ReadableBox<T>> {
    const fallbackBox = fallback !== undefined ? box.with(() => fallback) : undefined;
    return new Context<ReadableBox<T>>(name, fallbackBox);
  }
}
