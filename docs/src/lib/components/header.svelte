<script lang="ts">
	import IconGithub from "~icons/lucide/github";
	import IconMenu from "~icons/lucide/menu";
	import Search from "./search.svelte";
	import ThemeToggle from "./theme-toggle.svelte";

	interface Props {
		/** Toggles the sidebar on small screens; omitted outside the docs. */
		onmenu?: () => void;
	}

	let { onmenu }: Props = $props();
</script>

<header>
	{#if onmenu}
		<button type="button" class="icon-button menu" onclick={onmenu} aria-label="Toggle navigation">
			<IconMenu />
		</button>
	{/if}
	<a href="/" class="logo">motion<span>-sv</span></a>
	<nav>
		<Search />
		<a href="/docs">Docs</a>
		<a href="https://github.com/hanielu/motion-svelte" aria-label="GitHub"><IconGithub /></a>
		<ThemeToggle />
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: var(--header-height);
		padding: 0 1.25rem;
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(12px);
	}

	.logo {
		font-weight: 700;
		font-size: 1.0625rem;
		letter-spacing: -0.02em;
		text-decoration: none;
	}

	.logo span {
		color: var(--accent);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
		font-size: 0.875rem;
	}

	nav a {
		display: inline-flex;
		padding: 0.375rem 0.5rem;
		color: var(--text-muted);
		text-decoration: none;
	}

	nav a:hover {
		color: var(--text);
	}

	.menu {
		display: none;
	}

	@media (max-width: 64rem) {
		.menu {
			display: inline-flex;
		}
	}

	:global(.icon-button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 0.5rem;
		background: none;
		color: var(--text-muted);
		cursor: pointer;
	}

	:global(.icon-button:hover) {
		background: var(--surface);
		color: var(--text);
	}
</style>
