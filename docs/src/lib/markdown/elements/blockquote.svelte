<script lang="ts">
	import type { HTMLBlockquoteAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLBlockquoteAttributes = $props();
</script>

<blockquote {...rest}>{@render children?.()}</blockquote>

<style>
	blockquote {
		margin: 0 0 1.25rem;
		padding: 0.75rem 1rem;
		border-left: 3px solid var(--accent);
		border-radius: 0 0.5rem 0.5rem 0;
		background: var(--accent-soft);
	}

	blockquote > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
