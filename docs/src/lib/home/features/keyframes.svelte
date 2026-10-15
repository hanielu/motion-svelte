<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div class="keyframes">
	<motion.div
		class="box"
		animate={{
			scale: [1, 1.6, 1.6, 1, 1],
			rotate: [0, 0, 180, 180, 0],
			borderRadius: ["22%", "22%", "50%", "50%", "22%"],
		}}
		transition={{ duration: 2, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, repeatDelay: 0.8 }}
	/>
</div>

<style>
	.keyframes :global(.box) {
		width: 3.5rem;
		height: 3.5rem;
		background: #ff3e00;
	}
</style>
