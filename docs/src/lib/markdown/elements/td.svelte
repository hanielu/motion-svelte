<script lang="ts">
	import type { HTMLTdAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLTdAttributes = $props();
</script>

<td {...rest}>{@render children?.()}</td>

<style>
	td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border);
		vertical-align: top;
	}
</style>
