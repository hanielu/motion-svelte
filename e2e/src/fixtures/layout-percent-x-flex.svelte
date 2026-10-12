<script lang="ts">
	/**
	 * Regression test for https://github.com/motiondivision/motion/issues/3401
	 *
	 * Matches the reporter's sandbox pattern: only the most-recently-added item
	 * has initial/animate props. When the next item is added, shouldAnimate flips
	 * false for the previous item — its x animation stops and latestValues.x
	 * stays at "100%" indefinitely. The layout update then fires with an
	 * unresolved percentage, triggering the teleport bug.
	 */
	import { createLayoutMotion } from "motion-sv";

	interface Item {
		id: number;
		isAdded: boolean;
	}

	let items = $state<Item[]>([
		{ id: 0, isAdded: false },
		{ id: 1, isAdded: false },
	]);

	const layout = createLayoutMotion();

	const addItem = layout.update.with(() => (items = [...items, { id: items.length, isAdded: true }]));
</script>

<div style="display: flex; flex-direction: column; align-items: center; padding: 20px">
	<button id="add" onclick={addItem}>Add</button>
	<div style="display: flex; gap: 10px; margin-top: 20px">
		{#each items as item, i (item.id)}
			{@const shouldAnimate = i === items.length - 1 && item.isAdded}
			<layout.div
				id={`item-${item.id}`}
				initial={shouldAnimate ? { x: "100%" } : undefined}
				animate={shouldAnimate ? { x: 0 } : undefined}
				transition={{ duration: 10 }}
				style={{
					width: 100,
					height: 100,
					background: "red",
					flexShrink: 0,
				}}
			/>
		{/each}
	</div>
</div>
