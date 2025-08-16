<script
  lang="ts"
  generics="Props extends Record<string, any>, TagName extends keyof DOMMotionComponents | string = 'div'"
>
  import { isMotionValue } from "motion-dom";
  // import { Fragment, createElement, useMemo } from "react";
  import type { MotionProps } from "../../motion/types.js";
  import type { VisualState } from "../../motion/utils/use-visual-state.svelte.js";
  import type { HTMLRenderState } from "../html/types.js";
  import { useHTMLProps } from "../html/use-props.svelte.js";
  import type { SVGRenderState } from "../svg/types.js";
  import { useSVGProps } from "../svg/use-props.svelte.js";
  import type { DOMMotionComponents } from "./types.js";
  import { filterProps } from "./utils/filter-props.js";
  import { isSVGComponent } from "./utils/is-svg-component.js";
  import { untrack, type Component as SvelteComponent } from "svelte";
  import { read } from "runed";
  import { createAttachmentKey } from "svelte/attachments";
  import { createPopLayout } from "$lib/core/components/animate-presence/pop-child.svelte.js";
  import { nextSeq } from "$lib/utils/debug-seq.js";
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

  // Create a stable attachment key and callback so we don't unmount/mount the
  // VisualElement on every props change.
  const attachmentKey = createAttachmentKey();
  const attach = (node: HTMLElement | SVGElement) => {
    console.log(
      "[haniel][",
      nextSeq(),
      "][use-render] attach:start layoutRoot=",
      !!props.layoutRoot,
      "component=",
      Component
    );
    const cleanup = untrack(() => ref(node));
    console.log("[haniel][", nextSeq(), "][use-render] attach:mounted node=", node);
    // if (!(node instanceof HTMLElement)) return;
    // createPopLayout(node, presenceBox, {
    //   // Optionally pull anchor/root off a richer PresenceContext in future
    // });
    return () => {
      console.log(
        "[haniel][",
        nextSeq(),
        "][use-render] attach:cleanup layoutRoot=",
        !!props.layoutRoot
      );
      cleanup?.();
    };
  };

  const presenceBox = PresenceContext.get(); // ReadableBox<PresenceContextProps | null>

  // const popLayoutKey = createAttachmentKey();
  // const attachPopLayout = (node: HTMLElement | SVGElement) => {
  //   if (!(node instanceof HTMLElement)) return;
  //   createPopLayout(node, presenceBox, {
  //     // Optionally pull anchor/root off a richer PresenceContext in future
  //   });
  // };

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
    [attachmentKey]: attach,
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

  $effect(() => {
    if (props.layoutRoot) {
      const keys = Object.keys(elementProps);
      console.log("[haniel][", nextSeq(), "][use-render] layoutRoot elementProps keys=", keys);
      console.log(
        "[haniel][",
        nextSeq(),
        "][use-render] layoutRoot spread check: hasSpread=",
        true,
        "onclick=",
        !!elementProps.onclick,
        "style set=",
        !!elementProps.style
      );
    }
  });

  const testEmptyElementProps = {};
</script>

{#if props.layoutRoot}
  <button
    {...testEmptyElementProps}
    onclick={elementProps.onclick}
    style={elementProps.style}
    {@attach attach}
  >
    {@render elementProps.children?.()}
  </button>
{:else if typeof Component === "string"}
  <svelte:element this={Component} {...elementProps}>
    {@render props
      // @ts-expect-error TODO: (haniel) figure ts out
      // we need to figure out how to handle single motion values
      // set as the children prop
      .children?.()}
  </svelte:element>
{:else}
  <Component {...elementProps} />
{/if}
