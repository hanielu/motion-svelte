<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div class="example">
	<motion.div whileHover={{ scale: 1.2 }} whilePress={{ scale: 0.8 }} class="box" />
</div>

<style>
	.example :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 10px;
		background-color: #1e75f7;
	}
</style>
