<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const cardVariants: Variants = {
		offscreen: {
			y: 300,
		},
		onscreen: {
			y: 50,
			rotate: -10,
			transition: {
				type: "spring",
				bounce: 0.4,
				duration: 0.8,
			},
		},
	};

	const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

	const food: [string, number, number][] = [
		["🍅", 340, 10],
		["🍊", 20, 40],
		["🍋", 60, 90],
		["🍐", 80, 120],
		["🍏", 100, 140],
		["🫐", 205, 245],
		["🍆", 260, 290],
		["🍇", 290, 320],
	];

	// The cards scroll inside this box, so it's the viewport they come into view in
	let scroller = $state<HTMLElement>();
</script>

<div class="scroller" bind:this={scroller}>
	<div class="container">
		{#each food as [emoji, hueA, hueB] (emoji)}
			<motion.div
				class="card-container"
				initial="offscreen"
				whileInView="onscreen"
				inViewOptions={{ root: scroller, amount: 0.8 }}
			>
				<div class="splash" style:background="linear-gradient(306deg, {hue(hueA)}, {hue(hueB)})"></div>
				<motion.div class="card" variants={cardVariants}>
					{emoji}
				</motion.div>
			</motion.div>
		{/each}
	</div>
</div>

<style>
	.scroller {
		box-sizing: border-box;
		width: 100%;
		height: 500px;
		overflow-y: auto;
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 12px;
	}

	.container {
		width: 100%;
		max-width: 500px;
		margin: 100px auto;
		padding-bottom: 100px;
	}

	.scroller :global(.card-container) {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		padding-top: 20px;
		margin-bottom: -120px;
	}

	.splash {
		position: absolute;
		inset: 0;
		clip-path: path(
			"M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z"
		);
	}

	.scroller :global(.card) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 300px;
		height: 430px;
		border-radius: 20px;
		background: #f5f5f5;
		font-size: 164px;
		box-shadow:
			0 0 1px hsl(0deg 0% 0% / 0.075),
			0 0 2px hsl(0deg 0% 0% / 0.075),
			0 0 4px hsl(0deg 0% 0% / 0.075),
			0 0 8px hsl(0deg 0% 0% / 0.075),
			0 0 16px hsl(0deg 0% 0% / 0.075);
		transform-origin: 10% 60%;
	}
</style>
