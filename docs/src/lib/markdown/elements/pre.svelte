<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import CopyButton from "#lib/components/copy-button.svelte";

	let { children, ...rest }: HTMLAttributes<HTMLPreElement> = $props();

	let pre = $state<HTMLPreElement>();
</script>

<div class="code-block">
	<pre class="twinkleplop" bind:this={pre} {...rest}>{@render children?.()}</pre>
	<CopyButton text={() => pre?.textContent ?? ""} />
</div>

<style>
	.code-block {
		position: relative;
		margin: 0 0 1.5rem;
	}

	pre {
		margin: 0;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
	}

	.code-block:hover :global(.copy),
	.code-block :global(.copy:focus-visible) {
		opacity: 1;
	}
</style>
