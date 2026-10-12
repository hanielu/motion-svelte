<script lang="ts">
	import type { Snippet } from "svelte";
	import { useLayoutGroupProvider, type LayoutGroupProps } from "./use-layout-group.js";
	import type { FnGetter } from "@/types/common.js";

	let {
		inherit = true,
		id,
		children,
	}: LayoutGroupProps & { children: Snippet<[props: { forceRender: () => void; key: FnGetter<number> }]> } = $props();

	const { forceRender, key } = useLayoutGroupProvider({
		get inherit() {
			return inherit;
		},
		get id() {
			return id;
		},
	});
</script>

{@render children({ forceRender, key })}
