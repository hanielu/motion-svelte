<script lang="ts">
	import { ReorderGroup, ReorderItem, useMotionValue } from "motion-sv";

	const initialItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	/**
	 * Test case for auto-scroll when the scrollable container is inside a scrollable page.
	 *
	 * This tests the bug where autoscroll wouldn't work because the gesture system
	 * uses pageX/pageY coordinates but getBoundingClientRect() returns viewport
	 * coordinates. When the page is scrolled, these coordinate systems don't match.
	 */
	let items = $state(initialItems);
</script>

<!-- Spacer to make page scrollable -->
<div style="height: 300px; background: #222">
	<p style="color: #fff; padding: 20px">
		Scroll down to see the reorder list. The container and the page are both scrollable.
	</p>
</div>
<div
	data-testid="scroll-container"
	style="height: 300px; overflow: auto; margin: 0 auto; width: 300px; background: #444"
>
	<ReorderGroup axis="y" onReorder={(newOrder) => (items = newOrder)} values={items}>
		{#each items as item (item)}
			{@const y = useMotionValue(0)}
			{@const hue = item * 30}
			<ReorderItem
				value={item}
				id={String(item)}
				style={{
					y,
					backgroundColor: `hsl(${hue}, 70%, 50%)`,
				}}
				data-testid={String(item)}
			>
				<!-- motion-sv: ReorderItem renders `children` unconditionally (throws in dev without it), so pass an empty one -->
				{#snippet children()}{/snippet}
			</ReorderItem>
		{/each}
	</ReorderGroup>
</div>
<!-- More spacer to ensure page is scrollable -->
<div style="height: 500px; background: #222">
	<p style="color: #fff; padding: 20px">Bottom spacer</p>
</div>
<style>
	:global {
		html,
		body {
			width: 100%;
			min-height: 100%;
			background: #333;
			padding: 0;
			margin: 0;
		}

		ul,
		li {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		ul {
			position: relative;
			width: 100%;
		}

		li {
			border-radius: 10px;
			margin-bottom: 10px;
			width: 100%;
			height: 60px;
			position: relative;
			border-radius: 5px;
			flex-shrink: 0;
			cursor: grab;
		}
	}
</style>
