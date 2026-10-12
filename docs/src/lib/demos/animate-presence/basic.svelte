<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isVisible = $state(true);
</script>

<div class="stage">
	<div class="slot">
		<AnimatePresence>
			{#if isVisible}
				<motion.div
					class="box"
					initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
					animate={{ opacity: 1, scale: 1, rotate: 0 }}
					exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
				/>
			{/if}
		</AnimatePresence>
	</div>
	<button onclick={() => (isVisible = !isVisible)}>{isVisible ? "Hide" : "Show"}</button>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.slot {
		display: grid;
		place-items: center;
		width: 100px;
		height: 100px;
	}

	.stage :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 20px;
		background: #9911ff;
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #9911ff;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
