<script lang="ts">
  import type { Snippet } from "svelte";
  import type { VariantLabels } from "../../motion/types.js";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "$lib/core/context/presence-context.js";
  import { PresenceCollectorContext } from "./presence-collector.svelte";
  import { read } from "runed";

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

  const context = {
    id,
    initial,
    isPresent: read(() => isPresent),
    onExitComplete: (childId: string) => {
      presenceChildren.set(childId, true);

      for (const isComplete of presenceChildren.values()) {
        if (!isComplete) return; // can stop searching when any is incomplete
      }

      onExitComplete && onExitComplete();
    },
    register: (childId: string) => {
      presenceChildren.set(childId, false);
      return () => presenceChildren.delete(childId);
    },
  } as PresenceContextProps;

  $effect.pre(() => {
    const _ = isPresent;
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  });

  /**
   * If there's no `motion` components to fire exit animations, we want to remove this
   * component immediately.
   */
  $effect(() => {
    if (!isPresent && presenceChildren.size === 0) {
      onExitComplete?.();
    }
  });

  PresenceContext.set(context);
  PresenceCollectorContext.set({ hasParent: true });
</script>

{@render children?.()}
