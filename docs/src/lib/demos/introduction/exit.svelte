<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isVisible = $state(true);
</script>

<div class="stack">
	<div class="slot">
		<AnimatePresence>
			{#if isVisible}
				<motion.div
					style={{ width: 100, height: 100, borderRadius: 20, background: "#ff3e00" }}
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
				/>
			{/if}
		</AnimatePresence>
	</div>
	<motion.button class="toggle" whilePress={{ y: 1 }} onclick={() => (isVisible = !isVisible)}>
		{isVisible ? "Hide" : "Show"}
	</motion.button>
</div>

<style>
	.stack {
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

	.stack :global(.toggle) {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
