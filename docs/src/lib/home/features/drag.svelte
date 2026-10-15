<script lang="ts">
	import { motion } from "motion-sv";

	let area = $state<HTMLElement>();
</script>

<div class="area" bind:this={area}>
	<motion.div
		class="ball"
		drag
		dragConstraints={area}
		dragElastic={0.3}
		whileHover={{ scale: 1.15 }}
		whilePress={{ scale: 0.9 }}
		whileDrag={{ scale: 1.1 }}
	/>
</div>

<style>
	.area {
		position: absolute;
		inset: 1.5rem;
		display: grid;
		place-items: center;
	}

	.area :global(.ball) {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: #9911ff;
		cursor: grab;
		touch-action: none;
	}
</style>
