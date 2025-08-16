<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AnimatePresenceProps } from "./types.js";
  import { usePresence } from "./use-presence.svelte.js";
  import {
    PresenceCollectorContext,
    type ComponentKey,
    type PresenceEntry,
  } from "./presence-collector.svelte";
  import { LayoutGroupContext } from "$lib/core/context/layout-group-context.js";
  import { PresenceContext } from "$lib/core/context/presence-context.js";
  import type { VariantLabels } from "motion-dom";

  let {
    children,
    custom,
    initial = true,
    onExitComplete,
    presenceAffectsLayout = true,
    mode = "sync",
    propagate = false,
    anchorX = "left",
    root,
  }: AnimatePresenceProps = $props();

  /// Collector fills this each render when we invoke children()
  let presentChildren: PresenceEntry[] = $state([]);

  // Diff state
  let diffedChildren = $state<PresenceEntry[]>([]);
  let renderedChildren = $state<PresenceEntry[]>([]);
  let exitComplete = new Map<ComponentKey, boolean>();
  let pendingPresentChildren: PresenceEntry[] = [];
  let hasMountedOnce = $state(false);

  // Provide collector for the collect pass
  // TODO: (haniel) this might be the wrong strategy, only allow the collector to be set once
  function withCollector(fn: () => void) {
    PresenceCollectorContext.set({
      register(entry) {
        const i = presentChildren.findIndex(e => e.key === entry.key);
        if (i >= 0) presentChildren[i] = entry;
        else presentChildren = [...presentChildren, entry];
        return () => {
          console.log("unregistering", entry.key);
          presentChildren = presentChildren.filter(e => e.key !== entry.key);
        };
      },
    });
    fn();
    // Stop collecting for subsequent rendering
    PresenceCollectorContext.set(null);
  }

  const presentKeys = $derived(presentChildren.map(e => e.key));
  const { forceRender } = LayoutGroupContext.current;

  $effect(() => {
    const rc = renderedChildren;
    const pkSet = new Set(presentKeys);
    for (let i = 0; i < rc.length; i++) {
      const key = rc[i].key;
      if (!pkSet.has(key)) {
        if (exitComplete.get(key) !== true) exitComplete.set(key, false);
      } else {
        exitComplete.delete(key);
      }
    }
  });

  $effect(() => {
    const pc = presentChildren;
    if (pc !== diffedChildren) {
      const rc = renderedChildren;
      const pkSet = new Set(presentKeys);
      let nextChildren = pc.slice();
      const exiting: PresenceEntry[] = [];

      for (let i = 0; i < rc.length; i++) {
        const child = rc[i];
        if (!pkSet.has(child.key)) {
          nextChildren.splice(i, 0, child);
          exiting.push(child);
        }
      }

      if (mode === "wait" && exiting.length) {
        renderedChildren = exiting;
      } else {
        renderedChildren = nextChildren;
      }

      pendingPresentChildren = pc;
      diffedChildren = pc;
    }
  });

  function completeKey(key: ComponentKey) {
    if (exitComplete.has(key)) {
      exitComplete.set(key, true);
    } else {
      return;
    }

    let allDone = true;
    exitComplete.forEach(v => {
      if (!v) allDone = false;
    });

    if (allDone) {
      forceRender?.();
      renderedChildren = pendingPresentChildren;
      onExitComplete && onExitComplete();
    }
  }

  const PresenceGroup = ((anchor: Text, _entry: () => PresenceEntry, _isPresent: () => boolean) => {
    const entry = _entry();
    const isPresent = $derived(_isPresent());
    const presenceChildren = new Map<string, boolean>();

    // Reset completion flags on presence flip (render-phase equivalent)
    $effect.pre(() => {
      void isPresent;
      presenceChildren.forEach((_, k) => presenceChildren.set(k, false));
    });

    // If no registered motion children, complete immediately on exit
    $effect(() => {
      if (!isPresent && presenceChildren.size === 0) {
        completeKey(entry.key);
      }
    });

    // Provide per-entry presence; disable collector for the render phase
    PresenceContext.setWith(() => ({
      id: String(entry.key),
      get isPresent() {
        return isPresent;
      },
      register: (childId: string | number) => {
        presenceChildren.set(String(childId), false);
        return () => presenceChildren.delete(String(childId));
      },
      onExitComplete: (childId: string | number) => {
        presenceChildren.set(String(childId), true);
        for (const done of presenceChildren.values()) {
          if (!done) return;
        }
        completeKey(entry.key);
      },
      // Disable initial animations only for the very first render of AnimatePresence
      initial: !hasMountedOnce && initial === false ? (false as false | VariantLabels) : undefined,
      custom: entry.custom ?? custom,
    }));
    PresenceCollectorContext.set(null);

    // popLayout consumers read PresenceContext and apply an attachment (no wrapper)
    // Mount the motion subtree via the snippet we collected
    // @ts-expect-error snippet invocation
    entry.render(anchor);
  }) as unknown as Snippet<[_entry: PresenceEntry, _isPresent: boolean]>;

  const runCollector = ((anchor: Text) => {
    withCollector(() =>
      // @ts-expect-error this is how a snippet is called without
      // a render tag in the svelte template
      children?.(anchor)
    );
  }) as Snippet;

  // Mark the component as mounted to allow later children to play initial animations
  $effect(() => {
    hasMountedOnce = true;
  });
</script>

<!-- Collect pass: let motion children register themselves -->
{@render runCollector()}

<!-- Render pass: AnimatePresence manages which entries to mount -->
{#each renderedChildren as entry (entry.key)}
  {@const isPresent = presentChildren === renderedChildren || presentKeys.includes(entry.key)}
  {@render PresenceGroup(entry, isPresent)}
{/each}

<!-- 
	@component
	`AnimatePresence` enables the animation of components that have been removed from the tree.
	When adding/removing more than a single child, every child **must** be given a unique `key` prop.
	Any `motion` components that have an `exit` property defined will animate out when removed from
	the tree.
	```svelte
	<script lang="ts">
		import { motion, AnimatePresence } from 'framer-motion'
	</script>

	<AnimatePresence>
		{#each items as item}
			<motion.div
				key={item.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			/>
		{/each}
	</AnimatePresence>
	```

	You can sequence exit animations throughout a tree using variants.
	If a child contains multiple `motion` components with `exit` props, it will only unmount the child
	once all `motion` components have finished animating out. Likewise, any components using
	`usePresence` all need to call `safeToRemove`.
 -->
