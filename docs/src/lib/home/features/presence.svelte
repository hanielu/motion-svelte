<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";
	import IconPlus from "~icons/lucide/plus";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc", "#ff0088"];

	let nextId = 4;
	let items = $state([0, 1, 2, 3]);
	// Measured whenever items change, so the others close the gap or make room
	const layout = createLayoutMotion(() => items);

	const remove = (id: number) => (items = items.filter((item) => item !== id));
	const add = () => (items = [...items, nextId++]);
</script>

<div class="row">
	<AnimatePresence mode="popLayout" initial={false}>
		{#each items as id (id)}
			<layout.button
				type="button"
				class="shape"
				aria-label="Remove"
				style={{ background: colors[id % colors.length] }}
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0, opacity: 0 }}
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", visualDuration: 0.35, bounce: 0.3 }}
				onclick={() => remove(id)}
			/>
		{/each}
	</AnimatePresence>
	<layout.button type="button" class="add" aria-label="Add a shape" onclick={add} disabled={items.length >= 5}>
		<IconPlus />
	</layout.button>
</div>

<style>
	.row {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.row :global(.shape),
	.row :global(.add) {
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		cursor: pointer;
	}

	.row :global(.add) {
		display: grid;
		place-items: center;
		border: 1.5px dashed var(--border);
		background: none;
		color: var(--text-muted);
	}

	.row :global(.add:disabled) {
		opacity: 0.4;
		cursor: default;
	}
</style>
