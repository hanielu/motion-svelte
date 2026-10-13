<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p {...rest}>{@render children?.()}</p>

<style>
	p {
		margin: 0 0 1.5rem;
	}
</style>
