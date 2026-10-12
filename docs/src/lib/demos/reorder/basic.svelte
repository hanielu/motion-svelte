<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	let items = $state(["Tomato", "Cucumber", "Cheese", "Lettuce"]);
</script>

<div class="list">
	<ReorderGroup bind:values={items}>
		{#each items as item (item)}
			<ReorderItem value={item}>{item}</ReorderItem>
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
		margin: 0;
		padding: 14px 18px;
		border-radius: 10px;
		background: #ff3e00;
		color: white;
		font-weight: 600;
		cursor: grab;
	}
</style>
