<script lang="ts">
  import type { AnimatePresenceProps } from "./types.js";
  import { usePresence } from "./use-presence.svelte.js";
  import {
    PresenceCollectorContext,
    type ComponentKey,
    type PresenceEntry,
  } from "./presence-collector.svelte";
  import { getChildKey } from "./utils.js";
  import { watch } from "runed";
  import { LayoutGroupContext } from "$lib/core/context/layout-group-context.js";
  import PresenceChild from "./presence-child.svelte";
  import { flushSync } from "svelte";

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

  const id = $props.id();
  const [isParentPresent, safeToRemove] = usePresence(id, () => propagate);

  let presentChildren = $state<PresenceEntry[]>([]);

  /**
   * Track the keys of the currently rendered children. This is used to
   * determine which children are exiting.
   */
  const presentKeys = $derived(
    propagate && !isParentPresent ? [] : presentChildren.map(getChildKey)
  );

  /**
   * If `initial={false}` we only want to pass this to components in the first render.
   */
  let isInitialRender = true;

  /**
   * A ref containing the currently present children. When all exit animations
   * are complete, we use this to re-render the component with the latest children
   * *committed* rather than the latest children *rendered*.
   */
  let pendingPresentChildren = presentChildren;

  /**
   * Track which exiting children have finished animating out.
   */
  const exitComplete = new Map<ComponentKey, boolean>();

  /**
   * Save children to render as React state. To ensure this component is concurrent-safe,
   * we check for exiting children via an effect.
   */
  let diffedChildren = $state(presentChildren);
  let renderedChildren = $state(presentChildren);

  // $effect(() => {
  //   const interest = $state.snapshot(presentChildren);
  //   const interest2 = $state.snapshot(renderedChildren);
  //   console.log(
  //     "[haniel] animate presence collected",
  //     interest,
  //     interest2,
  //     // @ts-ignore
  //     arraysShallowEqual(interest, interest2)
  //   );
  // });

  $effect(() => {
    isInitialRender = false;
    pendingPresentChildren = presentChildren;

    /**
     * Update complete status of exiting children.
     */
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);

      const interest = JSON.stringify(
        {
          key,
          presentKeys,
        },
        null,
        2
      );

      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
          console.log("[haniel] animate presence collector exitComplete set", interest);
        }
      } else {
        exitComplete.delete(key);
        console.log("[haniel] animate presence collector exitComplete delete", interest);
      }
    }
  });

  const exitingChildren: any[] = [];

  watch(
    () => [presentChildren, diffedChildren, renderedChildren],
    ([presentChildren, diffedChildren, renderedChildren]) => {
      if (!arraysShallowEqual(presentChildren, diffedChildren)) {
        let nextChildren = [...presentChildren];

        /**
         * Loop through all the currently rendered components and decide which
         * are exiting.
         */
        for (let i = 0; i < renderedChildren.length; i++) {
          const child = renderedChildren[i];
          const key = getChildKey(child);

          if (!presentKeys.includes(key)) {
            nextChildren.splice(i, 0, child);
            exitingChildren.push(child);
          }
        }

        /**
         * If we're in "wait" mode, and we have exiting children, we want to
         * only render these until they've all exited.
         */
        if (mode === "wait" && exitingChildren.length) {
          nextChildren = exitingChildren;
        }

        renderedChildren = nextChildren;
        diffedChildren = presentChildren;

        /**
         * Early return to ensure once we've set state with the latest diffed
         * children, we can immediately re-render.
         */
        // return null;
      }
    }
  );

  $effect(() => {
    if (process.env.NODE_ENV !== "production" && mode === "wait" && renderedChildren.length > 1) {
      console.warn(
        `You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`
      );
    }
  });

  /**
   * If we've been provided a forceRender function by the LayoutGroupContext,
   * we can use it to force a re-render amongst all surrounding components once
   * all components have finished animating out.
   */
  const { forceRender } = LayoutGroupContext.current;

  PresenceCollectorContext.set({
    hasParent: false,
    register(entry) {
      presentChildren.push(entry);
      return () => {
        presentChildren = presentChildren.filter(e => e.key !== entry.key);
      };
    },
  });

  $effect(() => {
    const interest = $state.snapshot(renderedChildren);
    console.log("[haniel] animate presence collector", JSON.stringify(interest, null, 2));
  });

  $effect(() => {
    console.log("[haniel] animate presence collector presentKeys", presentKeys);
  });

  function arraysShallowEqual(a: PresenceEntry[], b: PresenceEntry[]) {
    return a.length === b.length && a.every((el, i) => el.key === b[i].key);
  }
</script>

{@render children()}

{#each renderedChildren as { key, children }}
  {@const isPresent =
    propagate && !isParentPresent
      ? false
      : arraysShallowEqual(presentChildren, renderedChildren) || presentKeys.includes(key)}

  {@const onExit = () => {
    // flushSync();
    console.log("[haniel] animate presence collector onExit", exitComplete);
    if (exitComplete.has(key)) {
      exitComplete.set(key, true);
    } else {
      return;
    }

    let isEveryExitComplete = true;
    exitComplete.forEach(isExitComplete => {
      if (!isExitComplete) isEveryExitComplete = false;
    });

    if (isEveryExitComplete) {
      forceRender?.();
      renderedChildren = pendingPresentChildren;

      propagate && safeToRemove?.();

      onExitComplete && onExitComplete();
      console.log("[haniel] animate presence collector onExit complete");
    }
  }}

  <PresenceChild
    {isPresent}
    initial={!isInitialRender || initial ? undefined : false}
    {custom}
    {presenceAffectsLayout}
    {mode}
    {root}
    onExitComplete={isPresent ? undefined : onExit}
    {anchorX}
    {children}
  />
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
