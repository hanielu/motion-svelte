<script lang="ts">
	import type { Snippet } from "svelte";
	import { useLayoutGroupProvider, type LayoutGroupProps } from "./use-layout-group.js";

	let {
		inherit = true,
		id,
		children,
	}: LayoutGroupProps & { children: Snippet<[props: { forceRender: () => void; key: () => number }]> } = $props();

	// svelte-ignore state_referenced_locally - the group is created once, from the initial props
	const { forceRender, key } = useLayoutGroupProvider({ inherit, id });
</script>

{@render children({ forceRender, key })}
