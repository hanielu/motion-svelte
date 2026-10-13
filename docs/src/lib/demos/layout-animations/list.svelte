<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	let nextId = 4;
	let items = $state([1, 2, 3]);
	const layout = createLayoutMotion(() => items);

	const add = () => (items = [nextId++, ...items]);
	const remove = (id: number) => (items = items.filter((item) => item !== id));
</script>

<div class="list-demo">
	<button class="add" onclick={add}>Add item</button>
	<ul>
		<AnimatePresence>
			{#each items as id (id)}
				<layout.li
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					onclick={() => remove(id)}
				>
					Item {id}
				</layout.li>
			{/each}
		</AnimatePresence>
	</ul>
</div>

<style>
	.list-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 260px;
	}

	.add {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ul :global(li) {
		padding: 12px 16px;
		border-radius: 10px;
		background: rgb(255 62 0 / 0.15);
		cursor: pointer;
	}
</style>
