<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	let container = $state<HTMLElement>();
	let target = $state<HTMLElement>();

	const { scrollYProgress } = useScroll({
		get container() {
			return container;
		},
		get target() {
			return target;
		},
		offset: ["start end", "end start"],
	});

	const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);
	const rotate = useTransform(scrollYProgress, [0, 1], [-90, 90]);
	const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ["50%", "15%", "50%"]);
</script>

<div class="scroller" bind:this={container}>
	<p>Scroll down</p>
	<div class="target" bind:this={target}>
		<motion.div class="box" style={{ scale, rotate, borderRadius }} />
	</div>
	<p>Scroll up</p>
</div>

<style>
	.scroller {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		width: 320px;
		height: 260px;
		overflow-y: auto;
		border-radius: 16px;
		background: rgb(12 220 247 / 0.1);
	}

	p {
		flex-shrink: 0;
		margin: 0;
		padding: 2rem 0 140px;
		font-size: 0.875rem;
		opacity: 0.7;
	}

	p:last-child {
		padding: 140px 0 2rem;
	}

	.target {
		flex-shrink: 0;
	}

	.scroller :global(.box) {
		width: 120px;
		height: 120px;
		background: #0cdcf7;
	}
</style>
