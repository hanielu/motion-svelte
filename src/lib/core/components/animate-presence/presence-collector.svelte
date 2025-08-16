<script lang="ts" module>
  import { Context } from "runed";
  import { warning } from "motion-utils";
  import type { Snippet } from "svelte";

  export type ComponentKey = string | number;

  export interface PresenceEntry {
    key: ComponentKey;
    children: Snippet;
  }

  export type PresenceCollector =
    | {
        hasParent: false;
        register: (entry: PresenceEntry) => () => void;
      }
    | {
        hasParent: true;
        register?: never;
      };

  export const PresenceCollectorContext = new Context<PresenceCollector | null>(
    "PresenceCollectorContext",
    null
  );
</script>

<script lang="ts">
  let { children, key }: PresenceEntry = $props();

  if (process.env.NODE_ENV !== "production") {
    warning(
      key != null,
      "AnimatePresence",
      "Missing `key` on motion element inside <AnimatePresence>."
    );
  }

  const collector = PresenceCollectorContext.get()!;
  const unregister = collector.register?.({ key, children });

  // $effect(() => () => unregister?.());

  $effect(() => {
    // console.log("collector registering", key);
    return () => {
      // console.log("collector unregistering", key);
      unregister?.();
    };
  });
</script>
