<script lang="ts">
	import { page } from "$app/state";

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	let headings = $state.raw<Heading[]>([]);
	let activeId = $state<string>();

	// Collect the page's headings once it has rendered (again on each navigation), and track the one being read.
	$effect(() => {
		void page.url.pathname;
		const elements = [...document.querySelectorAll<HTMLElement>(".markdown :is(h2, h3)[id]")];
		headings = elements.map((element) => ({
			id: element.id,
			text: element.textContent ?? "",
			level: Number(element.tagName[1]),
		}));
		activeId = undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible) activeId = visible.target.id;
			},
			{ rootMargin: "0px 0px -70% 0px" }
		);
		elements.forEach((element) => observer.observe(element));
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
