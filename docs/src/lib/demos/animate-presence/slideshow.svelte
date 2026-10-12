<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#ff0088"];
	let index = $state(0);
</script>

<div class="slideshow">
	<div class="viewport">
		<AnimatePresence initial={false}>
			{#key index}
				<motion.div
					class="slide"
					style={{ background: colors[index] }}
					initial={{ x: 300, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -300, opacity: 0 }}
					transition={{ type: "spring", visualDuration: 0.4, bounce: 0.2 }}
				>
					{index + 1}
				</motion.div>
			{/key}
		</AnimatePresence>
	</div>
	<button onclick={() => (index = (index + 1) % colors.length)}>Next</button>
</div>

<style>
	.slideshow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.viewport {
		position: relative;
		width: 240px;
		height: 140px;
	}

	.slideshow :global(.slide) {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		border-radius: 20px;
		color: white;
		font-size: 48px;
		font-weight: 700;
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
