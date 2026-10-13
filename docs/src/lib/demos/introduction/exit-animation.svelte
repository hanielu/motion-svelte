<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isVisible = $state(true);
</script>

<div class="container">
	<AnimatePresence initial={false}>
		{#if isVisible}
			<motion.div
				class="box"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
			/>
		{/if}
	</AnimatePresence>
	<motion.button class="button" onclick={() => (isVisible = !isVisible)} whilePress={{ y: 1 }}>
		{isVisible ? "Hide" : "Show"}
	</motion.button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100px;
		height: 160px;
		position: relative;
	}

	.container :global(.box) {
		width: 100px;
		height: 100px;
		background-color: #0cdcf7;
		border-radius: 10px;
	}

	.container :global(.button) {
		background-color: #0cdcf7;
		border: none;
		border-radius: 10px;
		padding: 10px 20px;
		color: #0b1012;
		font: inherit;
		font-size: 15px;
		font-weight: 540;
		line-height: 1;
		cursor: pointer;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
