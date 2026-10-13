<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 {...rest}>{@render children?.()}</h3>

<style>
	h3 {
		margin: 3rem 0 0.75rem;
		color: var(--text);
		font-size: 1.25rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}
</style>
