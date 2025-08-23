import { html, type InlineSnippet } from "@hvniel/vite-plugin-svelte-inline-component";

/**
 * Test utilities for Svelte components in vitest environment.
 *
 * This module provides helpers for mounting Svelte components in tests with a clean,
 * composable API that eliminates boilerplate and enables easy nested component testing.
 */
import type { ComponentInternals, Component, Snippet, ComponentProps } from "svelte";

const { _element } = html`
  <script lang="ts" module>
    export { _element };
  </script>
  {#snippet _element(html: string)} {@html html} {/snippet}
` as unknown as { _element: InlineSnippet<string> };

interface ElementFunction {
  (a: any, html: () => string): void;
  s: (html: () => string) => Snippet;
  c: (html: () => string) => Component;
}

/**
 * HTML rendering utility for tests. Provides three methods:
 * - `element(anchor, htmlFn)`: Direct HTML rendering to anchor
 * - `element.s(htmlFn)`: Returns a Snippet for use in component props
 * - `element.c(htmlFn)`: Returns a Component for use in mount functions
 *
 * @example
 * ```ts
 * // Direct rendering
 * element(anchor, () => "<h1>Hello</h1>");
 *
 * // As Snippet for component props
 * m(Route, {
 *   path: "/",
 *   element: element.s(() => "<h1>Home</h1>")
 * });
 *
 * // As Component for mount functions
 * m(element.c(() => "<div>Content</div>"));
 * ```
 */
const element = (_element || {}) as ElementFunction;
element.s = (html: () => string) => ((a: any) => element(a, html)) as Snippet;
element.c = element.s as ElementFunction["c"];

/**
 * Callback function type for mounting nested components.
 *
 * @param mount - Mount function for rendering child components. Use this to mount
 *                nested components within the current component's children prop.
 *
 * @example
 * ```ts
 * // The `mount` parameter lets you render nested components
 * m(MemoryRouter, { basename: "/app" }, mount => {
 *   // `mount` here is a Mount function for nested components
 *   mount(Routes, mount => {
 *     mount(Route, { path: "/", element: element.s(() => "<h1>Home</h1>") });
 *   });
 * });
 * ```
 */
export type MountChildren = (mount: Mount) => void;

/**
 * Mount function interface for rendering Svelte components in tests.
 *
 * Supports two calling patterns:
 * 1. `m(Component, props, children)` - Standard component mounting
 * 2. `m(Component, children)` - When no props are needed
 *
 * @template C - The component type
 * @param component - The Svelte component to mount
 * @param props - Component props OR children function when no props needed
 * @param children - Function that receives a mount instance for nested components
 *
 * @example
 * ```ts
 * // With props and children
 * m(MemoryRouter, { basename: "/app" }, m =>
 *   m(Routes, m =>
 *     m(Route, { path: "/", element: element.s(() => "<h1>Home</h1>") })
 *   )
 * )
 *
 * // Children only (no props)
 * m(Routes, m =>
 *   m(Route, { path: "/" })
 * )
 * ```
 */
export interface Mount {
  <C extends Component>(
    component: C,
    props?: ComponentProps<C> | MountChildren,
    children?: MountChildren
  ): void;
}

/**
 * Type guard to determine if a parameter is a children function.
 * @param x - Value to check
 * @returns True if x is a function that takes a Mount parameter
 */
function isChildFn(x: unknown): x is MountChildren {
  return typeof x === "function";
}

/**
 * Creates a Mount function bound to a specific ComponentInternals anchor.
 *
 * This is the core function that enables the composable mounting API.
 * It creates a mount function that can render components and handle
 * nested children through recursive mount creation.
 *
 * @param anchor - The ComponentInternals anchor to mount components to
 * @returns A Mount function that renders components to the given anchor
 *
 * @example
 * ```ts
 * const renderer = render(anchor => {
 *   const m = createMount(anchor);
 *   m(MyComponent, { prop: "value" });
 * });
 * ```
 */
export function createMount(anchor: ComponentInternals): Mount {
  const m: Mount = (component, propsOrChild?, maybeChild?) => {
    const child = isChildFn(propsOrChild) ? propsOrChild : maybeChild;
    const props = isChildFn(propsOrChild) ? {} : propsOrChild ?? {};

    component(anchor, {
      ...props,
      ...(child && {
        children: (a: ComponentInternals) => child(createMount(a)),
      }),
    });
  };

  return m;
}

/**
 * Creates a Svelte Snippet from a function that operates on ComponentInternals.
 *
 * This utility converts a function that takes ComponentInternals into a proper
 * Svelte Snippet that can be used in component props.
 *
 * @param fn - Function that takes ComponentInternals and performs rendering
 * @returns A Snippet that can be used in Svelte components
 *
 * @example
 * ```ts
 * const mySnippet = snippet(a => {
 *   element(a, () => "<h1>Hello World</h1>");
 * });
 * // Use in component: <MyComponent children={mySnippet} />
 * ```
 */
export function snippet(fn: (a: ComponentInternals) => void): Snippet {
  return ((a: ComponentInternals) => fn(a)) as Snippet;
}

/**
 * Component version of the snippet function.
 * Creates a Component instead of a Snippet for use with mount functions.
 * mostly just type safety since components and snippets are typically interchangeable
 * in usage
 */
snippet.c = snippet as (fn: (a: ComponentInternals) => void) => Component;

/**
 * Interface for the main mount function that can be used directly with render().
 *
 * This function signature allows for the clean API: `render(m(Component, ...))`
 * where the result of `m()` is a function compatible with vitest's render.
 */
interface RenderableMount {
  <C extends Component>(
    component: C,
    props?: ComponentProps<C> | MountChildren,
    children?: MountChildren
  ): (anchor: ComponentInternals) => void;
}

/**
 * The main mount function for clean test rendering.
 *
 * This provides the cleanest API for mounting components in tests:
 * `render(m(Component, props, children))` instead of needing to set up
 * `createMount` manually in every test.
 *
 * The function returns a function compatible with vitest's `render()`,
 * eliminating the need for wrapper functions.
 *
 * @param component - The Svelte component to mount
 * @param props - Component props OR children function when no props needed
 * @param children - Function for nested component mounting
 * @returns Function compatible with vitest render() that mounts the component tree
 *
 * @example
 * ```ts
 * // Clean API - no wrapper functions needed
 * const renderer = render(
 *   m(MemoryRouter, { basename: "/app" }, mount =>
 *     mount(Routes, mount =>
 *       mount(Route, {
 *         path: "/",
 *         element: element.s(() => "<h1>Home</h1>")
 *       })
 *     )
 *   )
 * );
 *
 * // Compare to the old way:
 * const renderer = render(anchor => {
 *   const mount = createMount(anchor);
 *   mount(MemoryRouter, { basename: "/app" }, mount => {
 *     // ... same nesting
 *   });
 * });
 * ```
 */
export const m: RenderableMount = (component, propsOrChild?, maybeChild?) => {
  const child = isChildFn(propsOrChild) ? propsOrChild : maybeChild;
  const props = isChildFn(propsOrChild) ? {} : propsOrChild ?? {};

  return (anchor: ComponentInternals) => {
    const mount = createMount(anchor);
    mount(component, props as any, child);
  };
};

import type { Locator } from "@vitest/browser/context";

/**
 * Defines the shape of a Svelte element with a compiler-generated click handler.
 */
type SvelteClickableElement = HTMLElement & {
  __click: [(_: any, fn: () => void) => void, () => void];
};

/**
 * Accepts a `Locator` instance and returns its executable Svelte `on:click` handler.
 * This is useful for testing click logic without simulating a full DOM event.
 *
 * @param locator The `Locator` instance from a query (e.g., `screen.getByText(...)`).
 * @returns A zero-argument function that executes the Svelte `on:click` handler.
 */
export function createClickGetter(locator: Locator): () => void | Promise<void> {
  const element = locator.element() as SvelteClickableElement;

  if (!element.__click || !Array.isArray(element.__click) || element.__click.length < 2) {
    throw new Error(
      "The located element does not appear to have a Svelte `onclick` handler. " +
        "Ensure the element in your component has an `onclick` directive."
    );
  }

  // The Svelte compiler generates `__click` as an array where `__click[0]` is the
  // internal wrapper and `__click[1]` is the actual function provided to `on:click`.
  // Calling `__click[0](null, __click[1])` executes the handler.
  return () => element.__click[0](null, element.__click[1]);
}

export { element, html };
