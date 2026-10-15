<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc", "#ff0088", "#ffd23f"];

	let tiles = $state(colors);
	// Measured whenever the order changes, so every reorder animates
	const layout = createLayoutMotion(() => tiles);

	function shuffle() {
		tiles = [...tiles].sort(() => Math.random() - 0.5);
	}

	// Keeps shuffling, so the card shows itself off; a click shuffles straight away
	$effect(() => {
		const timer = setInterval(shuffle, 2200);
		return () => clearInterval(timer);
	});
</script>

<button type="button" class="grid" onclick={shuffle} aria-label="Shuffle the tiles">
	{#each tiles as color (color)}
		<layout.div
			class="tile"
			style={{ background: color }}
			transition={{ type: "spring", visualDuration: 0.45, bounce: 0.25 }}
		/>
	{/each}
</button>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 2.75rem);
		gap: 0.625rem;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}

	.grid :global(.tile) {
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 0.75rem;
	}
</style>
