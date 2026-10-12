<script lang="ts">
	import type { HTMLThAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLThAttributes = $props();
</script>

<th {...rest}>{@render children?.()}</th>

<style>
	th {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border);
		color: var(--text-muted);
		font-weight: 600;
		text-align: left;
	}
</style>
