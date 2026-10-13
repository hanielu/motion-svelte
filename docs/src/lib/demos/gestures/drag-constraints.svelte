<script lang="ts">
	import { motion } from "motion-sv";

	let constraints = $state<HTMLElement>();
</script>

<div bind:this={constraints} class="constraints">
	<motion.div drag dragConstraints={constraints} dragElastic={0.2} class="box" />
</div>

<style>
	.constraints {
		width: 300px;
		height: 300px;
		border-radius: 10px;
		background-color: #ff008844;
	}

	.constraints :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 10px;
		background-color: #ff0088;
	}
</style>
