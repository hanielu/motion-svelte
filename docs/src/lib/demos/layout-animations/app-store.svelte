<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	interface Card {
		id: string;
		category: string;
		title: string;
		content: string[];
		theme: "light" | "dark";
		background: string;
		top?: number;
		bottom?: number;
		width?: string;
		left?: number;
	}

	// Gradients stand in for the original's photos. "light" cards have light titles on a dark image, "dark" ones the
	// reverse.
	const items: Card[] = [
		{
			id: "a",
			category: "Travel",
			title: "5 Inspiring Apps for Your Next Trip",
			content: [
				"Love to travel? So do the makers of these five subscription apps. For a small monthly fee, they'll help you find the best deals on flights, hotels, and some other stuff we turn a blind eye to.",
				"Plan your perfect itinerary with intelligent recommendations based on your interests, time, and credit history.",
			],
			top: -300,
			theme: "light",
			background: "linear-gradient(160deg, #9911ff, #1e75f7)",
		},
		{
			id: "c",
			category: "How to",
			title: "Contemplate the Meaning of Life Twice a Day",
			content: [
				`What is life? You can't spell "life" without "i". You also can't spell "life" without "l", "f", and "e". Worth thinking about.`,
				"The only way to find out more about life is to think about it. And the only way to think about it is twice daily using an app.",
				"Apps? We got 'em. Therefore we got the meaning of life.",
			],
			bottom: -50,
			theme: "dark",
			background: "linear-gradient(160deg, #8df0cc, #0cdcf7)",
			width: "110%",
			left: -20,
		},
		{
			id: "d",
			category: "Steps",
			title: "Urban Exploration Apps for the Vertically-Inclined",
			content: [
				"Get off the beaten path. Find the best views, skywalks, and elevated gardens in your city.",
				"Locked door? No problem! This app crowdsources the access code to every door in your city.",
			],
			theme: "dark",
			width: "200%",
			background: "linear-gradient(160deg, #0cdcf7, #e0fbf2)",
			left: -100,
		},
		{
			id: "b",
			category: "Hats",
			title: "Take Control of Your Hat Life With This Stunning New App",
			content: [
				"Whether you're serious hat enthusiast, or just a filthy casual, this new app revolutionizes how you organize, care for, and expand your hat collection.",
				"Stay up to date with the latest hat trends, get personalized hat care reminders, and use predictive analytics to discover the last place you left your hat.",
				"Why follow the crowd when you can be the crowd?",
			],
			bottom: -100,
			theme: "light",
			background: "linear-gradient(160deg, #ff0088, #dd00ee)",
		},
	];

	let openId = $state<string | null>(null);

	function open(id: string) {
		openId = id;
	}

	function close() {
		openId = null;
	}
</script>

<!-- The list card and the open card share layoutIds, so opening and closing animates one into the other -->
{#snippet cardContent(card: Card, isOpen: boolean)}
	<motion.div class="card-content" layoutId="card-container-{card.id}">
		<motion.div class="card-image-container" layoutId="card-image-container-{card.id}">
			<motion.div
				class="card-image"
				style={{
					background: card.background,
					top: card.top ?? "auto",
					bottom: card.bottom ?? "auto",
					width: card.width ?? "100%",
					left: card.left ?? "auto",
				}}
				layoutId="card-image-{card.id}"
			/>
		</motion.div>
		<motion.div class="title-container" layoutId="title-container-{card.id}" layout="position">
			<span class="h6">{card.category}</span>
			<h2 class="h3">{card.title}</h2>
		</motion.div>
		{#if isOpen}
			<motion.div class="content-container small">
				{#each card.content as paragraph}
					<p class="big">{paragraph}</p>
				{/each}
			</motion.div>
		{/if}
	</motion.div>
{/snippet}

<div class="app-store">
	<header>
		<div>
			<h2 class="store-title">Today</h2>
		</div>
		<div class="avatar"></div>
	</header>
	<!-- Store front -->
	<div>
		<ul class="card-list">
			{#each items as card (card.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
				<li class={["card", card.theme]} onclick={() => open(card.id)}>
					{@render cardContent(card, false)}
				</li>
			{/each}
		</ul>
		<!-- Item detail, rendered per card so a closing card keeps its content while it animates back -->
		<AnimatePresence>
			{#each items as card (card.id)}
				{#if openId === card.id}
					<motion.div
						class="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2, delay: 0.1 }}
						onclick={close}
					/>
					<div class={["card-content-container", "open", card.theme]}>
						{@render cardContent(card, true)}
					</div>
				{/if}
			{/each}
		</AnimatePresence>
	</div>
</div>

<style>
	.app-store {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 990px;
		margin: 0 auto;
	}

	.app-store,
	.app-store :global(*) {
		box-sizing: border-box;
	}

	header {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 50%;
		background: linear-gradient(135deg, #ff0088, #9911ff);
	}

	.store-title {
		margin: 5px 0;
		font-size: 34px;
		font-weight: 640;
		line-height: 1;
		letter-spacing: -0.05em;
	}

	ul,
	li {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.card-list {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 10px;
	}

	.card {
		position: relative;
		flex: 0 1 calc(50% - 5px);
		height: 280px;
		padding: 0;
	}

	.card-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.card-content-container.open {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 1000001;
		justify-content: center;
		padding: 0;
		overflow: hidden;
	}

	.dark .h3,
	.dark span {
		color: #0f1115;
	}

	.app-store :global(.card-content) {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 20px;
		background: #ffffff;
		color: #18222e;
		overflow: hidden;
		pointer-events: auto;
	}

	.open :global(.card-content) {
		width: unset;
		height: unset;
		max-width: 700px;
		overflow: hidden;
		pointer-events: none;
	}

	.app-store :global(.card-image-container) {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		height: 280px;
		overflow: hidden;
	}

	.app-store :global(.card-image) {
		position: absolute;
		width: 100%;
		aspect-ratio: 3 / 2;
	}

	li :global(.card-image) {
		top: unset !important;
		right: 0 !important;
		bottom: -10px !important;
		left: 0 !important;
		min-width: 250px;
		min-height: 300px;
	}

	.open :global(.card-image-container),
	.open :global(.title-container) {
		z-index: 1;
	}

	.app-store :global(.title-container) {
		position: absolute;
		top: 15px;
		left: 15px;
		max-width: 300px;
	}

	li :global(.title-container) {
		visibility: hidden;
	}

	.open :global(.title-container) {
		top: 30px;
		left: 30px;
	}

	.h6 {
		font-size: 12px;
		font-weight: 590;
		line-height: 1;
	}

	.h3 {
		margin: 8px 0;
		color: #fff;
		font-size: 22px;
		font-weight: 530;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.app-store :global(.overlay) {
		position: fixed;
		inset: 0;
		z-index: 1000000;
		background: rgba(0, 0, 0, 0.8);
		will-change: opacity;
	}

	.app-store :global(.content-container) {
		width: 90vw;
		max-width: 700px;
		padding: 35px;
	}

	.app-store :global(.small) {
		font-size: 15px;
		font-weight: 480;
		line-height: 1.4;
		letter-spacing: -0.01em;
	}

	.big {
		margin: 0;
		color: rgb(127 127 127);
		font-size: 16px;
		line-height: 1.3;
	}
</style>
