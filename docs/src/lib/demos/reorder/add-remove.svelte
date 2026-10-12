<script lang="ts">
	import { AnimatePresence, LayoutGroup, ReorderGroup, ReorderItem, createLayoutMotion } from "motion-sv";

	const fruits = ["Apple", "Banana", "Cherry", "Grape", "Kiwi", "Lemon"];

	// The add button moves with the list: the LayoutGroup measures it along with the items.
	const layout = createLayoutMotion();

	let items = $state(fruits.slice(0, 3));

	function add() {
		const next = fruits.find((fruit) => !items.includes(fruit));
		if (next) items = [next, ...items];
	}

	const remove = (item: string) => (items = items.filter((other) => other !== item));
</script>

<div class="list">
	<LayoutGroup>
		<ReorderGroup bind:values={items}>
			<AnimatePresence initial={false}>
				{#each items as item (item)}
					<ReorderItem
						value={item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
					>
						{item}
						<button onclick={() => remove(item)} aria-label="Remove {item}">×</button>
					</ReorderItem>
				{/each}
			</AnimatePresence>
		</ReorderGroup>
		<layout.button class="add" onclick={add} disabled={items.length === fruits.length}>Add item</layout.button>
	</LayoutGroup>
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 12px;
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
		padding: 10px 10px 10px 18px;
		border-radius: 10px;
		background: #9911ff;
		color: white;
		font-weight: 600;
		cursor: grab;
	}

	.list :global(li button) {
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 6px;
		background: rgb(255 255 255 / 0.2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.list :global(.add) {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: rgb(153 17 255 / 0.2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.list :global(.add:disabled) {
		opacity: 0.5;
		cursor: default;
	}
</style>
