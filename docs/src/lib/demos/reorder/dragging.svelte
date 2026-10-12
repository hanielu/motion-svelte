<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	let items = $state(["Red", "Green", "Blue"]);
</script>

<div class="list">
	<ReorderGroup bind:values={items}>
		{#each items as item (item)}
			<ReorderItem
				value={item}
				style={{ boxShadow: "0 0 0 rgb(0 0 0 / 0)" }}
				whileDrag={{ scale: 1.04, boxShadow: "0 8px 24px rgb(0 0 0 / 0.25)" }}
			>
				{#snippet children(isDragging)}
					{item}
					<span class={["badge", { visible: isDragging }]}>Dragging</span>
				{/snippet}
			</ReorderItem>
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
		padding: 14px 18px;
		border-radius: 10px;
		background: #8df0cc;
		color: #0f172a;
		font-weight: 600;
		cursor: grab;
	}

	.badge {
		padding: 2px 8px;
		border-radius: 999px;
		background: rgb(15 23 42 / 0.15);
		font-size: 12px;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.badge.visible {
		opacity: 1;
	}
</style>
