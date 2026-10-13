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
	import { getPageHeadings } from "./headings.svelte.js";

	interface Props {
		metadata: { title: string; description?: string };
		children: Snippet;
	}

	let { metadata, children }: Props = $props();

	const pageHeadings = getPageHeadings();
	let article = $state<HTMLElement>();

	// Publish the headings from this article only: while a navigation swaps pages, both are briefly in the DOM.
	$effect(() => {
		if (!article) return;
		pageHeadings.current = [...article.querySelectorAll<HTMLElement>(":is(h2, h3)[id]")].map((element) => ({
			id: element.id,
			text: element.textContent ?? "",
			level: Number(element.tagName[1]),
			element,
		}));
	});
</script>

<svelte:head>
	<title>{metadata.title} · motion-sv</title>
	{#if metadata.description}
		<meta name="description" content={metadata.description} />
	{/if}
</svelte:head>

<article bind:this={article} class="markdown">
	<h1>{metadata.title}</h1>
	{#if metadata.description}
		<p class="lead">{metadata.description}</p>
	{/if}
	{@render children()}
</article>

<style>
	article {
		min-width: 0;
		color: var(--text-body);
		font-size: 1rem;
		line-height: 1.72;
		letter-spacing: -0.01em;
	}

	/* Prose reads best in a narrow column. Demos, code and tables use the full width. */
	article > :global(:not(.demo, .code-block, .table)) {
		max-width: 40rem;
	}

	article :global(strong) {
		color: var(--text);
	}

	h1 {
		margin: 0 0 0.75rem;
		color: var(--text);
		font-size: 2.5rem;
		line-height: 1.1;
		letter-spacing: -0.035em;
	}

	.lead {
		margin: 0 0 2rem;
		color: var(--text);
		font-size: 1.375rem;
		line-height: 1.45;
		letter-spacing: -0.015em;
	}

	/* Inline code. mdsx renders it as escaped text rather than through an element component, so it's styled here,
	   leaving code blocks and the demos inside the page alone. */
	article :global(code:not(pre code, .demo *)) {
		padding: 0.125rem 0.3125rem;
		border-radius: 0.25rem;
		background: var(--surface);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 0.86em;
		letter-spacing: 0;
	}

	article :global(a code) {
		color: inherit;
	}
</style>
