<script lang="ts">
	import { motion } from "motion-sv";

	let constraints = $state<HTMLElement>();
</script>

<div class="area" bind:this={constraints}>
	<motion.div
		class="box"
		drag
		dragConstraints={constraints}
		dragElastic={0.2}
		whileDrag={{ scale: 1.1 }}
	/>
</div>

<style>
	.area {
		display: grid;
		place-items: center;
		width: 320px;
		height: 200px;
		border-radius: 20px;
		background: rgb(12 220 247 / 0.15);
	}

	.area :global(.box) {
		width: 60px;
		height: 60px;
		border-radius: 14px;
		background: #0cdcf7;
		cursor: grab;
	}
</style>
