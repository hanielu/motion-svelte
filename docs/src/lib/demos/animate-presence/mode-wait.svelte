<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const steps = [
		{ label: "Ordered", color: "#ff3e00" },
		{ label: "Shipped", color: "#9911ff" },
		{ label: "Delivered", color: "#0cdcf7" },
	];

	let index = $state(0);
	const step = $derived(steps[index]);
</script>

<div class="stage">
	<AnimatePresence mode="wait">
		{#key index}
			<motion.div
				class="status"
				style={{ background: step.color }}
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -16 }}
				transition={{ duration: 0.2 }}
			>
				{step.label}
			</motion.div>
		{/key}
	</AnimatePresence>
	<button onclick={() => (index = (index + 1) % steps.length)}>Next step</button>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.stage :global(.status) {
		padding: 12px 28px;
		border-radius: 999px;
		color: white;
		font-size: 20px;
		font-weight: 600;
	}

	button {
		padding: 8px 20px;
		border: 1px solid currentColor;
		border-radius: 8px;
		background: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
</style>
