<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul {...rest}>{@render children?.()}</ul>

<style>
	ul {
		margin: 0 0 1.5rem;
		padding-left: 1.375rem;
	}
</style>
