<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2 {...rest}>{@render children?.()}</h2>

<style>
	h2 {
		margin: 3rem 0 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 1.5rem;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}
</style>
