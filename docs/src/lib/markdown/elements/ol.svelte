<script lang="ts">
	import type { HTMLOlAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLOlAttributes = $props();
</script>

<ol {...rest}>{@render children?.()}</ol>

<style>
	ol {
		margin: 0 0 1rem;
		padding-left: 1.5rem;
	}
</style>
