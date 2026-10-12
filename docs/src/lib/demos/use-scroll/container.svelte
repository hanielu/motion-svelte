<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let container = $state<HTMLElement>();

	const { scrollYProgress } = useScroll({
		get container() {
			return container;
		},
	});
</script>

<div class="frame">
	<motion.div class="progress" style={{ scaleX: scrollYProgress }} />
	<div class="scroller" bind:this={container}>
		{#each { length: 8 }, i}
			<div class="block">{i + 1}</div>
		{/each}
	</div>
</div>

<style>
	.frame {
		position: relative;
		width: min(100%, 420px);
		border-radius: 16px;
		overflow: hidden;
		background: rgb(255 0 136 / 0.08);
	}

	.frame :global(.progress) {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 1;
		height: 6px;
		background: #ff0088;
		transform-origin: 0%;
	}

	.scroller {
		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 220px;
		padding: 20px;
		overflow-y: auto;
	}

	.block {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		height: 80px;
		border-radius: 12px;
		background: rgb(255 0 136 / 0.15);
	}
</style>
