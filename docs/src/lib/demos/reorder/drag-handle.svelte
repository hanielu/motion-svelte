<script lang="ts">
	import { ReorderGroup } from "motion-sv";
	import Item from "./drag-handle/item.svelte";

	let items = $state(["Write the docs", "Ship the release", "Celebrate"]);
</script>

<div class="list">
	<ReorderGroup bind:values={items}>
		{#each items as item (item)}
			<Item {item} />
		{/each}
	</ReorderGroup>
</div>

<style>
	.list {
		width: 280px;
	}

	.list :global(ul) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.list :global(li) {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0;
		padding: 8px 8px 8px 18px;
		border-radius: 10px;
		background: #0cdcf7;
		color: #0f172a;
		font-weight: 600;
	}
</style>
