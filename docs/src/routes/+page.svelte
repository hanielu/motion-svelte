<script lang="ts">
	import Header from "#lib/components/header.svelte";
	import HeroShapes from "#lib/home/hero-shapes.svelte";
	import { browser } from "$app/env";
	import IconArrowRight from "~icons/lucide/arrow-right";
	import IconArrowUpRight from "~icons/lucide/arrow-up-right";
	import IconCheck from "~icons/lucide/check";
	import IconCopy from "~icons/lucide/copy";

	const install = "npm install motion-sv";

	const features = [
		{ title: "Animations", text: "Declarative animations, keyframes, variants and springs.", href: "/docs/animation" },
		{
			title: "Gestures",
			text: "Hover, press, focus, pan and drag, for mouse, touch and keyboard.",
			href: "/docs/gestures",
		},
		{
			title: "Layout",
			text: "Animate between any two layouts, even across elements.",
			href: "/docs/layout-animations",
		},
		{
			title: "Exit animations",
			text: "Keep elements on the page while they animate out.",
			href: "/docs/animate-presence",
		},
		{ title: "Scroll", text: "Scroll-triggered and scroll-linked animations.", href: "/docs/scroll-animations" },
		{
			title: "Motion values",
			text: "Animate outside of Svelte's render cycle, at 120fps.",
			href: "/docs/motion-value",
		},
	];

	let copied = $state(false);

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(install);
		} catch {
			return; // Clipboard access denied: the command stays visible to copy by hand
		}
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>motion-sv · Motion for Svelte</title>
	<meta name="description" content="Production-ready animations, gestures, layout and scroll effects for Svelte 5." />
</svelte:head>

<Header />

<main>
	<section class="hero">
		<div class="intro">
			<h1>Motion for <span>Svelte</span></h1>
			<p>
				Production-ready animations, gestures, layout and scroll effects for Svelte 5, powered by the same engine as
				Motion for React and Vue.
			</p>
			<div class="actions">
				<a class="primary" href="/docs">Get started <IconArrowRight /></a>
				<button type="button" class="install" onclick={copyInstall} aria-label="Copy install command">
					<code>{install}</code>
					{#if copied}<IconCheck />{:else}<IconCopy />{/if}
				</button>
			</div>
		</div>
		<div class="showcase">
			{#if browser}<HeroShapes />{/if}
		</div>
	</section>

	<section class="features">
		{#each features as feature (feature.href)}
			<a href={feature.href}>
				<h2>{feature.title}</h2>
				<p>{feature.text}</p>
			</a>
		{/each}
	</section>

	<a class="components" href="https://sv-animations.vercel.app" target="_blank" rel="noopener">
		<div>
			<h2>Ready-made components</h2>
			<p>Svelte Animations has 50+ free, open-source animated components and effects built with motion-sv.</p>
		</div>
		<IconArrowUpRight />
	</a>
</main>

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem 6rem;
	}

	.hero {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		align-items: center;
		gap: 3rem;
		min-height: 32rem;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(2.5rem, 6vw, 4rem);
		line-height: 1.05;
		letter-spacing: -0.04em;
	}

	h1 span {
		color: var(--accent);
	}

	.intro p {
		max-width: 32rem;
		margin: 0 0 2rem;
		color: var(--text-muted);
		font-size: 1.125rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.primary,
	.install {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.75rem;
		padding: 0 1.25rem;
		border-radius: 0.625rem;
		font: inherit;
		font-weight: 500;
		text-decoration: none;
	}

	.primary {
		background: var(--accent);
		color: white;
	}

	.install {
		border: 1px solid var(--border);
		background: var(--bg-subtle);
		color: var(--text);
		cursor: pointer;
	}

	.install code {
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}

	.showcase {
		display: grid;
		place-items: center;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.features a,
	.components {
		padding: 1.25rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--bg-subtle);
		text-decoration: none;
		transition: border-color 0.2s;
	}

	.features a:hover,
	.components:hover {
		border-color: var(--accent);
	}

	.components {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
	}

	.features h2,
	.components h2 {
		margin: 0 0 0.375rem;
		font-size: 1rem;
	}

	.features p,
	.components p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	@media (max-width: 52rem) {
		.hero {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 3rem 0 2rem;
		}

		.features {
			grid-template-columns: 1fr;
		}
	}
</style>
