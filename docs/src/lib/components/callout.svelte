<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		type?: "note" | "tip" | "warning";
		children: Snippet;
	}

	let { type = "note", children }: Props = $props();

	const labels = { note: "Note", tip: "Tip", warning: "Warning" };
</script>

<aside class={["callout", type]}>
	<strong>{labels[type]}</strong>
	<div>{@render children()}</div>
</aside>

<style>
	.callout {
		margin: 0 0 1.5rem;
		padding: 0.875rem 1rem;
		border: 1px solid var(--border);
		border-left-width: 3px;
		border-radius: 0.5rem;
		background: var(--bg-subtle);
		font-size: 0.9375rem;
		line-height: 1.65;
	}

	.tip {
		border-left-color: #22c55e;
	}

	.note {
		border-left-color: #3b82f6;
	}

	.warning {
		border-left-color: #f59e0b;
	}

	strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	div > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
