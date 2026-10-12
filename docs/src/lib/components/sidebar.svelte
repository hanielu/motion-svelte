<script lang="ts">
	import { page } from "$app/state";
	import { href, navigation } from "#lib/navigation.js";

	interface Props {
		/** Called when a link is followed, e.g. to close the mobile navigation. */
		onnavigate?: () => void;
	}

	let { onnavigate }: Props = $props();
</script>

<nav aria-label="Documentation">
	{#each navigation as section (section.title)}
		<section>
			<h2>{section.title}</h2>
			<ul>
				{#each section.pages as doc (doc.slug)}
					{const link = href(doc)}
					<li>
						<a href={link} class={{ active: page.url.pathname === link }} onclick={onnavigate}>
							{doc.title}
							{#if doc.svelteOnly}<span class="badge">Svelte</span>{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem 1rem 3rem;
		font-size: 0.875rem;
	}

	h2 {
		margin: 0 0 0.5rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3125rem 0.75rem;
		border-radius: 0.375rem;
		color: var(--text-muted);
		text-decoration: none;
	}

	a:hover {
		color: var(--text);
		background: var(--surface);
	}

	a.active {
		color: var(--accent);
		background: var(--accent-soft);
		font-weight: 500;
	}

	.badge {
		padding: 0 0.375rem;
		border-radius: 999px;
		background: var(--surface);
		color: var(--text-muted);
		font-size: 0.6875rem;
		font-weight: 500;
	}
</style>
