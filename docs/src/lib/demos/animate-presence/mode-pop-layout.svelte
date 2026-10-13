<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc", "#ff0088"];

	let nextId = 5;
	let items = $state([0, 1, 2, 3, 4]);
	const layout = createLayoutMotion(() => items);

	const add = () => (items = [...items, nextId++]);
	const remove = (id: number) => (items = items.filter((item) => item !== id));
</script>

<div class="stage">
	<ul class="row">
		<AnimatePresence mode="popLayout" initial={false}>
			{#each items as id (id)}
				<layout.li
					class="chip"
					style={{ background: colors[id % colors.length] }}
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.6 }}
					transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
					onclick={() => remove(id)}
				/>
			{/each}
		</AnimatePresence>
	</ul>
	<button onclick={add}>Add</button>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.row {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		width: 380px;
		min-height: 64px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row :global(.chip) {
		width: 64px;
		height: 64px;
		margin: 0;
		border-radius: 16px;
		cursor: pointer;
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff0088;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
