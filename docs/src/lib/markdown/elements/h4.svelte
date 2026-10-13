<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h4 {...rest}>{@render children?.()}</h4>

<style>
	h4 {
		margin: 2rem 0 0.5rem;
		color: var(--text);
		font-size: 1rem;
	}
</style>
