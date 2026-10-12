<script lang="ts">
	import Header from "#lib/components/header.svelte";
	import Pager from "#lib/components/pager.svelte";
	import Sidebar from "#lib/components/sidebar.svelte";
	import Toc from "#lib/components/toc.svelte";

	let { children } = $props();

	let menuOpen = $state(false);
</script>

<Header onmenu={() => (menuOpen = !menuOpen)} />

<div class="docs">
	<aside class={["sidebar", { open: menuOpen }]}>
		<Sidebar onnavigate={() => (menuOpen = false)} />
	</aside>
	<main>
		{@render children()}
		<Pager />
	</main>
	<aside class="toc">
		<Toc />
	</aside>
</div>

<style>
	.docs {
		display: grid;
		grid-template-columns: 16rem minmax(0, 1fr) 13rem;
		gap: 2.5rem;
		max-width: 90rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.sidebar,
	.toc {
		position: sticky;
		top: var(--header-height);
		height: calc(100dvh - var(--header-height));
		overflow-y: auto;
	}

	main {
		min-width: 0;
		max-width: 48rem;
		padding: 2.5rem 0 4rem;
	}

	@media (max-width: 80rem) {
		.docs {
			grid-template-columns: 16rem minmax(0, 1fr);
		}

		.toc {
			display: none;
		}
	}

	@media (max-width: 64rem) {
		.docs {
			grid-template-columns: minmax(0, 1fr);
			padding: 0 1rem;
		}

		.sidebar {
			position: fixed;
			inset: var(--header-height) 0 0;
			z-index: 10;
			display: none;
			height: auto;
			background: var(--bg);
		}

		.sidebar.open {
			display: block;
		}
	}
</style>
