<script lang="ts">
  import type { Snippet } from "svelte";
  import type { VariantLabels } from "../../motion/types.js";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "$lib/core/context/presence-context.js";
  import { PresenceCollectorContext } from "./presence-collector.svelte";

  interface PresenceChildProps {
    children: Snippet;
    isPresent: boolean;
    onExitComplete?: () => void;
    initial?: false | VariantLabels;
    custom?: any;
    presenceAffectsLayout: boolean;
    mode: "sync" | "popLayout" | "wait";
    anchorX?: "left" | "right";
    root?: HTMLElement | ShadowRoot;
  }

  let {
    children,
    initial,
    isPresent,
    onExitComplete,
    custom,
    presenceAffectsLayout,
    mode,
    anchorX,
    root,
  }: PresenceChildProps = $props();

  const presenceChildren = new Map<string, boolean>();
  const id = $props.id();

  const context = $derived({
    id,
    initial,
    isPresent,
    onExitComplete: (childId: string) => {
      console.log("[haniel] collector onExitComplete", childId, onExitComplete);
      presenceChildren.set(childId, true);

      for (const isComplete of presenceChildren.values()) {
        console.log("[haniel] collector onExitComplete isComplete", isComplete);
        if (!isComplete) return; // can stop searching when any is incomplete
      }

      onExitComplete && onExitComplete();
    },
    register: (childId: string) => {
      presenceChildren.set(childId, false);
      // console.log("[haniel] collector register", childId);
      return () => {
        // console.log("[haniel] collector unregister", childId);
        presenceChildren.delete(childId);
      };
    },
  } as PresenceContextProps);

  $effect.pre(() => {
    const _ = isPresent;
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  });

  $effect(() => {
    // console.log("[haniel] collector isPresent", isPresent);
  });

  /**
   * If there's no `motion` components to fire exit animations, we want to remove this
   * component immediately.
   */
  $effect(() => {
    console.log("[haniel] collector i ran o", isPresent, presenceChildren.size, onExitComplete);
    if (!isPresent && presenceChildren.size === 0) {
      onExitComplete?.();
    }
  });

  $effect(() => {
    console.log("collector presenceChildren", presenceChildren);

    return () => {
      console.log("collector presenceChildren unregistering", id);
    };
  });

  PresenceContext.setWith(() => context);
  PresenceCollectorContext.set({ hasParent: true });

  console.log("[haniel] collector children", children);
</script>

{@render children?.()}
