<script lang="ts">
	import { motion, useScroll, useSpring } from "motion-sv";

	let container = $state<HTMLElement>();

	const { scrollYProgress } = useScroll({
		get container() {
			return container;
		},
	});

	const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
</script>

<div class="progress-demo">
	<motion.div class="bar" style={{ scaleX }} />
	<div class="scroller" bind:this={container}>
		{#each { length: 24 }, i (i)}
			<div class="line" style:width="{50 + ((i * 37) % 50)}%"></div>
		{/each}
	</div>
</div>

<style>
	.progress-demo {
		width: 320px;
		overflow: hidden;
		border-radius: 16px;
		background: rgb(255 62 0 / 0.08);
	}

	.progress-demo :global(.bar) {
		height: 6px;
		background: #ff3e00;
		transform-origin: 0%;
	}

	.scroller {
		display: flex;
		flex-direction: column;
		gap: 12px;
		box-sizing: border-box;
		height: 220px;
		padding: 1.25rem;
		overflow-y: auto;
	}

	.line {
		flex-shrink: 0;
		height: 12px;
		border-radius: 6px;
		background: rgb(255 62 0 / 0.25);
	}
</style>
