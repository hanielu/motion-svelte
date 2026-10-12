<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const items = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc"];

	// A function variant receives each element's `custom` value
	const variants: Variants = {
		hidden: { opacity: 0, x: -60 },
		visible: (index: number) => ({ opacity: 1, x: 0, transition: { delay: index * 0.1 } }),
	};

	let isVisible = $state(true);
</script>

<div class="stack">
	<motion.ul class="list" initial="hidden" animate={isVisible ? "visible" : "hidden"}>
		{#each items as color, index (color)}
			<motion.li custom={index} {variants} style={{ background: color }} />
		{/each}
	</motion.ul>
	<button onclick={() => (isVisible = !isVisible)}>{isVisible ? "Hide" : "Show"}</button>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.stack :global(.list) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 200px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stack :global(.list li) {
		height: 24px;
		border-radius: 8px;
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
