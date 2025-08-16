import type { VisualElement } from "$lib/core/render/VisualElement.js";
import type { ReadableBox } from "runed";
import type { VisualState } from "./use-visual-state.svelte.js";

/**
 * Svelte 5 helper to mirror React's useMotionRef semantics.
 * Call this inside an effect when the bound DOM node (instance) changes.
 * It will:
 * - invoke visualState.onMount(instance)
 * - mount the visualElement on the instance
 * - return a cleanup that unmounts the visualElement
 */
type ExternalRef<Instance> = (node: Instance | null) => void;

/**
 * Returns an attachment/ref callback suitable for Svelte 5 attachments.
 * Pass this directly to UseRender via `ref={useMotionRef(...)}.`
 */
export function useMotionRef<Instance, RenderState>(
  visualState: ReadableBox<VisualState<Instance, RenderState>>,
  visualElement?: ReadableBox<VisualElement<Instance> | undefined>,
  externalRef?: ExternalRef<Instance>
) {
  return (node: Instance) => {
    if (node) {
      visualState.current.onMount?.(node);
    }
    console.log("[haniel] useMotionRef", visualState.current);

    if (visualElement?.current) {
      console.log("[haniel] useMotionRef mount", visualElement.current.mount);
      visualElement.current.mount(node);
    }
    externalRef?.(node);

    return () => {
      visualElement?.current?.unmount();
      externalRef?.(null);
    };

    // AI generated code below
    // if (!node) return;
    // visualState.current.onMount(node);
    // visualElement.current?.mount(node);
    // externalRef?.(node);
    // return () => {
    //   visualElement.current?.unmount();
    //   externalRef?.(null);
    // };
  };
}
