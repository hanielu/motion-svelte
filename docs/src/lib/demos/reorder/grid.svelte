<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc", "#ff0088", "#ffaa00", "#2e7cf6", "#36d399"];

	let items = $state(colors.map((color, index) => ({ id: index + 1, color })));
</script>

<div class="grid">
	<ReorderGroup axis="xy" bind:values={items}>
		{#each items as item (item.id)}
			<ReorderItem value={item} style={{ background: item.color }}>{item.id}</ReorderItem>
		{/each}
	</ReorderGroup>
</div>

<style>
	.grid :global(ul) {
		display: grid;
		grid-template-columns: repeat(4, 72px);
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid :global(li) {
		position: relative;
		display: grid;
		place-items: center;
		height: 72px;
		margin: 0;
		border-radius: 16px;
		color: white;
		font-size: 22px;
		font-weight: 700;
		cursor: grab;
	}
</style>
