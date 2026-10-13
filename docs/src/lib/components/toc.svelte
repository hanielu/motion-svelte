<script lang="ts">
	import type { Heading } from "#lib/markdown/headings.svelte.js";

	let { headings }: { headings: Heading[] } = $props();

	let activeId = $state<string>();

	// Track the heading being read
	$effect(() => {
		activeId = undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible) activeId = visible.target.id;
			},
			{ rootMargin: "0px 0px -70% 0px" }
		);
		headings.forEach(({ element }) => observer.observe(element));
		return () => observer.disconnect();
	});
</script>

{#if headings.length}
	<nav aria-label="On this page">
		<h2>On this page</h2>
		<ul>
			{#each headings as heading (heading.id)}
				<li class={{ nested: heading.level === 3 }}>
					<a href="#{heading.id}" class={{ active: activeId === heading.id }}>{heading.text}</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	nav {
		padding: 1.5rem 0;
		font-size: 0.8125rem;
	}

	h2 {
		margin: 0 0 0.5rem;
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

	li.nested {
		padding-left: 0.75rem;
	}

	a {
		display: block;
		padding: 0.1875rem 0;
		color: var(--text-muted);
		text-decoration: none;
	}

	a:hover,
	a.active {
		color: var(--text);
	}

	a.active {
		color: var(--accent);
	}
</style>
