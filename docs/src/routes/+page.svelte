<script lang="ts">
	import Header from "#lib/components/header.svelte";
	import Drag from "#lib/home/features/drag.svelte";
	import Follow from "#lib/home/features/follow.svelte";
	import Keyframes from "#lib/home/features/keyframes.svelte";
	import Presence from "#lib/home/features/presence.svelte";
	import Scroll from "#lib/home/features/scroll.svelte";
	import Shuffle from "#lib/home/features/shuffle.svelte";
	import HeroShapes from "#lib/home/hero-shapes.svelte";
	import SvelteAnimations from "#lib/home/svelte-animations.svelte";
	import { browser } from "$app/env";
	import { MotionConfig } from "motion-sv";
	import IconArrowRight from "~icons/lucide/arrow-right";
	import IconCheck from "~icons/lucide/check";
	import IconCopy from "~icons/lucide/copy";

	const install = "npm install motion-sv";

	// Each card is a live demo of its feature
	const features = [
		{
			title: "Animations",
			text: "Keyframes, springs and variants. Change a value, and Motion animates to it.",
			hint: "Keyframes on a loop",
			href: "/docs/animation",
			demo: Keyframes,
		},
		{
			title: "Gestures",
			text: "Hover, press, focus and drag, for mouse, touch and keyboard.",
			hint: "Drag, hover or press the ball",
			href: "/docs/gestures",
			demo: Drag,
		},
		{
			title: "Layout animations",
			text: "Animate any layout change with transforms, even between different elements.",
			hint: "Click to shuffle",
			href: "/docs/layout-animations",
			demo: Shuffle,
		},
		{
			title: "Exit animations",
			text: "Elements animate out before Svelte removes them, and the rest make room.",
			hint: "Click a shape to remove it",
			href: "/docs/animate-presence",
			demo: Presence,
		},
		{
			title: "Scroll",
			text: "Link any value to scroll progress, or animate elements as they come into view.",
			hint: "Scroll the list",
			href: "/docs/scroll-animations",
			demo: Scroll,
		},
		{
			title: "Motion values",
			text: "Springy values that update at 120fps without re-rendering Svelte.",
			hint: "Move your pointer here",
			href: "/docs/motion-value",
			demo: Follow,
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

<MotionConfig reducedMotion="user">
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
			<header>
				<h2>Everything Motion does, in Svelte</h2>
				<p>Every card is live. Play with it, then read how it works.</p>
			</header>
			<div class="grid">
				{#each features as feature (feature.href)}
					<article class="card">
						<div class="stage">
							<feature.demo />
							<span class="hint">{feature.hint}</span>
						</div>
						<a class="body" href={feature.href}>
							<h3>{feature.title}</h3>
							<p>{feature.text}</p>
							<span class="more">Learn more <IconArrowRight /></span>
						</a>
					</article>
				{/each}
			</div>
		</section>

		<SvelteAnimations />
	</main>
</MotionConfig>

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

	.features header {
		margin: 2rem 0 1.5rem;
	}

	.features h2 {
		margin: 0 0 0.375rem;
		font-size: 1.75rem;
		letter-spacing: -0.03em;
	}

	.features header p {
		margin: 0;
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.card {
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--bg-subtle);
		transition: border-color 0.2s;
	}

	.card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.card:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
	}

	/* The demo area: the dot grid shows the space a demo moves in */
	.stage {
		position: relative;
		display: grid;
		place-items: center;
		height: 13.5rem;
		overflow: hidden;
		border-bottom: 1px solid var(--border);
		background:
			radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0) 0 0 / 1.25rem 1.25rem,
			var(--bg);
	}

	.hint {
		position: absolute;
		bottom: 0.75rem;
		color: var(--text-muted);
		font-size: 0.75rem;
		pointer-events: none;
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1.25rem;
		text-decoration: none;
	}

	.body h3 {
		margin: 0 0 0.375rem;
		font-size: 1.0625rem;
	}

	.body p {
		flex: 1;
		margin: 0 0 1rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--accent);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.more :global(svg) {
		transition: transform 0.2s;
	}

	.body:hover .more :global(svg) {
		transform: translateX(3px);
	}

	@media (max-width: 52rem) {
		.hero {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 3rem 0 2rem;
		}

		.grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 52rem) and (max-width: 68rem) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
