<script lang="ts">
	import type { HTMLLiAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLLiAttributes = $props();
</script>

<li {...rest}>{@render children?.()}</li>

<style>
	li {
		padding-left: 0.25rem;
		line-height: 1.65;
	}

	li:not(:first-child) {
		margin-top: 0.5rem;
	}

	/* A list item's paragraphs (a "loose" list) and nested lists don't need their own spacing */
	li > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
