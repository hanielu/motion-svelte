<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let { container, label }: { container: HTMLElement | undefined; label: string } = $props();

	let target = $state<HTMLElement>();

	// 0 when the item's top enters at the bottom of the container, 1 when its bottom leaves at the top
	const { scrollYProgress } = useScroll({
		get container() {
			return container;
		},
		get target() {
			return target;
		},
		offset: ["start end", "end start"],
	});
</script>

<div class="item" bind:this={target}>
	<svg width="48" height="48" viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="20" class="track" />
		<motion.circle cx="24" cy="24" r="20" class="indicator" style={{ pathLength: scrollYProgress }} />
	</svg>
	{label}
</div>

<style>
	.item {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 120px;
		padding: 0 24px;
		border-radius: 12px;
		background: rgb(12 220 247 / 0.15);
	}

	svg {
		transform: rotate(-90deg);
	}

	svg :global(circle) {
		fill: none;
		stroke-width: 6;
	}

	.track {
		stroke: rgb(12 220 247 / 0.25);
	}

	svg :global(.indicator) {
		stroke: #0cdcf7;
	}
</style>
