<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	let items = $state(Array.from({ length: 12 }, (_, index) => index + 1));
</script>

<div class="scroller">
	<ReorderGroup bind:values={items}>
		{#each items as item (item)}
			<ReorderItem value={item} style={{ background: `hsl(${item * 30} 90% 60%)` }}>Item {item}</ReorderItem>
		{/each}
	</ReorderGroup>
</div>

<style>
	.scroller {
		width: 280px;
		height: 220px;
		padding: 8px;
		border-radius: 14px;
		background: rgb(255 0 136 / 0.1);
		overflow-y: auto;
	}

	.scroller :global(ul) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.scroller :global(li) {
		position: relative;
		margin: 0;
		padding: 12px 16px;
		border-radius: 10px;
		color: #0f172a;
		font-weight: 600;
		cursor: grab;
	}
</style>
