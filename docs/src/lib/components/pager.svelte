<script lang="ts">
	import { page } from "$app/state";
	import { href, pages } from "#lib/navigation.js";

	const index = $derived(pages.findIndex((doc) => href(doc) === page.url.pathname));
	const previous = $derived(index > 0 ? pages[index - 1] : undefined);
	const next = $derived(index >= 0 ? pages[index + 1] : undefined);
</script>

<nav aria-label="Pagination">
	{#if previous}
		<a href={href(previous)} class="previous"><span>Previous</span>{previous.title}</a>
	{/if}
	{#if next}
		<a href={href(next)} class="next"><span>Next</span>{next.title}</a>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}

	a {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 0.75rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		font-weight: 500;
		text-decoration: none;
	}

	a:hover {
		border-color: var(--accent);
	}

	span {
		color: var(--text-muted);
		font-size: 0.75rem;
		font-weight: 400;
	}

	.next {
		align-items: flex-end;
		margin-left: auto;
	}
</style>
