<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	const hues = ["#ff0088", "#dd00ee", "#9911ff", "#1e75f7", "#0cdcf7", "#8df0cc"];

	let items = $state(Array.from({ length: 16 }, (_, index) => index + 1));
</script>

<div class="reorder-stage">
	<ReorderGroup as="div" bind:values={items} class="reorder-grid" aria-label="Reorderable grid">
		{#each items as item (item)}
			<ReorderItem
				as="div"
				value={item}
				class="reorder-item"
				transition={{ type: "spring", stiffness: 350, damping: 30 }}
				whileDrag={{ scale: 1.08 }}
				style={{ backgroundColor: hues[item % 6] }}
			>
				{String(item).padStart(2, "0")}
			</ReorderItem>
		{/each}
	</ReorderGroup>
</div>

<style>
	.reorder-stage {
		display: flex;
		justify-content: center;
		align-items: center;
		touch-action: none;
	}

	.reorder-stage :global(.reorder-grid) {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		width: min(76vw, 420px);
	}

	.reorder-stage :global(.reorder-item) {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		color: #0b1012;
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		font-size: clamp(11px, 2.2vw, 15px);
		font-weight: 600;
		cursor: grab;
		user-select: none;
	}

	.reorder-stage :global(.reorder-item:active) {
		cursor: grabbing;
	}
</style>
