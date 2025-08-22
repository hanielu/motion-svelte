<script
  lang="ts"
  generics="Props extends Record<string, any>, TagName extends keyof DOMMotionComponents | string = 'div'"
>
  import { isMotionValue } from "motion-dom";
  import type { MotionProps } from "../../motion/types.js";
  import type { VisualState } from "../../motion/utils/use-visual-state.js";
  import type { HTMLRenderState } from "../html/types.js";
  import { useHTMLProps } from "../html/use-props.svelte.js";
  import type { SVGRenderState } from "../svg/types.js";
  import { useSVGProps } from "../svg/use-props.svelte.js";
  import type { DOMMotionComponents } from "./types.js";
  import { filterProps } from "./utils/filter-props.js";
  import { isSVGComponent } from "./utils/is-svg-component.js";
  import { untrack, type Component as SvelteComponent } from "svelte";
  import { read } from "runed";
  import { type Attachment } from "svelte/attachments";
  import { PresenceContext } from "$lib/core/context/presence-context.js";

  type UseRenderProps = {
    Component: TagName | string | SvelteComponent<Props>;
    props: MotionProps;
    ref: (node: HTMLElement | SVGElement) => () => void;
    latestValues: VisualState<
      HTMLElement | SVGElement,
      HTMLRenderState | SVGRenderState
    >["latestValues"];
    isStatic: boolean;
    forwardMotionProps?: boolean;
  };

  let {
    Component,
    props,
    ref,
    latestValues,
    isStatic,
    forwardMotionProps = false,
  }: UseRenderProps = $props();

  const useVisualProps = isSVGComponent(Component) ? useSVGProps : useHTMLProps;

  const visualProps = useVisualProps(
    read(() => props) as any,
    read(() => latestValues),
    isStatic,
    Component as any
  );
  const filteredProps = $derived(
    filterProps(props, typeof Component === "string", forwardMotionProps)
  );
  const elementProps = $derived({
    ...filteredProps,
    ...visualProps.current,
  });

  /**
   * If component has been handed a motion value as its child,
   * memoise its initial value and render that. Subsequent updates
   * will be handled by the onChange handler
   */
  // const { children } = props;
  // const renderedChildren = useMemo(
  //   () => (isMotionValue(children) ? children.get() : children),
  //   [children]
  // );
  const children = props.children;
  const renderedChildren = isMotionValue(children) ? children.get() : children;

  const presenceBox = PresenceContext.get(); // PresenceContextProps | null

  const attach: Attachment<HTMLElement | SVGElement> = node => {
    const cleanup = untrack(() => ref(node));
    // if (!(node instanceof HTMLElement)) return;
    // createPopLayout(node, presenceBox, {
    //   // Optionally pull anchor/root off a richer PresenceContext in future
    // });
    return cleanup;
  };
</script>

{#if typeof Component === "string"}
  <svelte:element this={Component} {...elementProps} {@attach attach}>
    {@render props
      // @ts-expect-error TODO: (haniel) figure ts out
      // we need to figure out how to handle single motion values
      // set as the children prop
      .children?.()}
  </svelte:element>
{:else}
  <Component {...elementProps} {@attach attach} />
{/if}
