<script lang="ts">
	import { ReorderGroup, ReorderItem, useMotionValue } from "motion-sv";

	const initialItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	let items = $state(initialItems);
</script>

<div data-testid="scroll-container" style="height: 300px; overflow: auto">
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

<style>
	:global {
		body {
			width: 100vw;
			height: 100vh;
			background: #333;
			overflow: hidden;
			padding: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		ul,
		li {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		ul {
			position: relative;
			width: 300px;
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
