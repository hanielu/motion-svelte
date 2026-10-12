<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 {...rest}>{@render children?.()}</h3>

<style>
	h3 {
		margin: 2rem 0 0.75rem;
		font-size: 1.125rem;
	}
</style>
