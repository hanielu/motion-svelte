<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2 {...rest}>{@render children?.()}</h2>

<style>
	h2 {
		margin: 4.5rem 0 1rem;
		color: var(--text);
		font-size: 1.875rem;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}
</style>
