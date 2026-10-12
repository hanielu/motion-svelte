<script lang="ts">
	import { motion } from "motion-sv";

	const shapes = [
		{ color: "#ff3e00", radius: "50%", x: -90, rotate: 0 },
		{ color: "#9911ff", radius: "22%", x: 0, rotate: 45 },
		{ color: "#0cdcf7", radius: "8px", x: 90, rotate: 0 },
	];

	let container = $state<HTMLElement>();
</script>

<!-- The hero's shapes: they spring in, react to hover and press, and can be thrown around. -->
<div class="shapes" bind:this={container}>
	{#each shapes as shape, i (shape.color)}
		<motion.div
			class="shape"
			style={{ background: shape.color, borderRadius: shape.radius }}
			initial={{ opacity: 0, scale: 0, x: shape.x, y: 40, rotate: shape.rotate - 90 }}
			animate={{ opacity: 1, scale: 1, x: shape.x, y: 0, rotate: shape.rotate }}
			transition={{ type: "spring", bounce: 0.45, delay: 0.15 + i * 0.1 }}
			whileHover={{ scale: 1.12 }}
			whilePress={{ scale: 0.92 }}
			drag
			dragConstraints={container}
			dragElastic={0.4}
		/>
	{/each}
</div>

<style>
	.shapes {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 26rem;
		height: 14rem;
	}

	.shapes :global(.shape) {
		position: absolute;
		width: 4.5rem;
		height: 4.5rem;
		cursor: grab;
	}
</style>
