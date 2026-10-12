<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h4 {...rest}>{@render children?.()}</h4>

<style>
	h4 {
		margin: 1.5rem 0 0.5rem;
		font-size: 1rem;
	}
</style>
