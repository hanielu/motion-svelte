<script lang="ts" module>
	// Markdown elements render through these components, whose styles stay off the demos inside pages.
	export {
		a,
		blockquote,
		h2,
		h3,
		h4,
		hr,
		li,
		ol,
		p,
		pre,
		table,
		td,
		th,
		ul,
	} from "./elements/index.js";
</script>

<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		metadata: { title: string; description?: string };
		children: Snippet;
	}

	let { metadata, children }: Props = $props();
</script>

<svelte:head>
	<title>{metadata.title} · motion-sv</title>
	{#if metadata.description}
		<meta name="description" content={metadata.description} />
	{/if}
</svelte:head>

<article class="markdown">
	<h1>{metadata.title}</h1>
	{#if metadata.description}
		<p class="lead">{metadata.description}</p>
	{/if}
	{@render children()}
</article>

<style>
	article {
		min-width: 0;
		font-size: 0.9375rem;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2.25rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.lead {
		margin: 0 0 2rem;
		color: var(--text-muted);
		font-size: 1.125rem;
	}

	/* Inline code. mdsx renders it as escaped text rather than through an element component, so it's styled here,
	   leaving code blocks and the demos inside the page alone. */
	article :global(code:not(pre code, .demo *)) {
		padding: 0.125rem 0.375rem;
		border-radius: 0.375rem;
		background: var(--surface);
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
</style>
