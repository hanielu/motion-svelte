<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div class="container">
	<motion.div drag class="box" />
</div>

<style>
	.container {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.container :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 10px;
		background-color: #8df0cc;
	}
</style>
