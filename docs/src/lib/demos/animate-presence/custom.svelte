<script lang="ts">
	import { AnimatePresence, motion, type Variants } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#ff0088"];

	let index = $state(0);
	let direction = $state(1);

	const variants: Variants = {
		enter: (direction: number) => ({ x: direction * 300, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (direction: number) => ({ x: direction * -300, opacity: 0 }),
	};

	function paginate(newDirection: number) {
		direction = newDirection;
		index = (index + newDirection + colors.length) % colors.length;
	}
</script>

<div class="slideshow">
	<div class="viewport">
		<AnimatePresence initial={false} custom={direction}>
			{#key index}
				<motion.div
					class="slide"
					style={{ background: colors[index] }}
					custom={direction}
					{variants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ type: "spring", visualDuration: 0.4, bounce: 0.2 }}
				>
					{index + 1}
				</motion.div>
			{/key}
		</AnimatePresence>
	</div>
	<div class="controls">
		<button onclick={() => paginate(-1)} aria-label="Previous">←</button>
		<button onclick={() => paginate(1)} aria-label="Next">→</button>
	</div>
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

	.controls {
		display: flex;
		gap: 0.5rem;
	}

	button {
		width: 44px;
		height: 36px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
