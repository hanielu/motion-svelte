import type { ComponentKey, PresenceEntry } from "./presence-collector.svelte";

export const getChildKey = (child: PresenceEntry): ComponentKey => child.key || "";
