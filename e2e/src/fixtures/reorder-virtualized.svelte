<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	const ITEM_HEIGHT = 50;
	const allItems = Array.from({ length: 50 }, (_, i) => `Item ${i}`);

	let items = $state(allItems);
	let scrollRef: HTMLDivElement | undefined = $state();

	/**
	 * Stand-in for @tanstack/react-virtual (not available to these fixtures): the same range math as
	 * `useVirtualizer({ count: items.length, getScrollElement: () => scrollRef, estimateSize: () => ITEM_HEIGHT, overscan: 0 })`
	 * without measureElement, i.e. every item is ITEM_HEIGHT and the range is recomputed on scroll and resize.
	 */
	let outerSize = $state(0);
	let scrollOffset = $state(0);

	$effect(() => {
		const element = scrollRef;
		if (!element) return;
		const measure = () => {
			outerSize = element.offsetHeight;
			scrollOffset = element.scrollTop;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		element.addEventListener("scroll", measure, { passive: true });
		return () => {
			observer.disconnect();
			element.removeEventListener("scroll", measure);
		};
	});

	const virtualItems = $derived.by(() => {
		const count = items.length;
		if (!count || outerSize <= 0) return [];
		const startIndex = Math.min(Math.floor(scrollOffset / ITEM_HEIGHT), count - 1);
		let endIndex = startIndex;
		while (endIndex < count - 1 && (endIndex + 1) * ITEM_HEIGHT < scrollOffset + outerSize) endIndex++;
		return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
			const index = startIndex + i;
			return { index, start: index * ITEM_HEIGHT, end: (index + 1) * ITEM_HEIGHT };
		});
	});

	// Spacer heights to maintain correct scroll area
	const paddingTop = $derived(virtualItems.length > 0 ? virtualItems[0].start : 0);
	const paddingBottom = $derived(
		virtualItems.length > 0 ? items.length * ITEM_HEIGHT - virtualItems[virtualItems.length - 1].end : 0
	);
</script>

<div>
	<div bind:this={scrollRef} style="height: 300px; overflow: auto">
		<ReorderGroup
			axis="y"
			values={items}
			onReorder={(newOrder) => (items = newOrder)}
			style={{
				listStyle: "none",
				padding: 0,
				margin: 0,
			}}
		>
			{#if paddingTop > 0}
				<li style="height: {paddingTop}px; padding: 0px; border: none"></li>
			{/if}
			{#each virtualItems as virtualItem (items[virtualItem.index])}
				{@const item = items[virtualItem.index]}
				<ReorderItem
					value={item}
					id={item.replace(/\s/g, "-")}
					style={{
						height: ITEM_HEIGHT,
						padding: "10px",
						boxSizing: "border-box",
						background: `hsl(${(virtualItem.index * 7.2) % 360}, 80%, 90%)`,
						borderBottom: "1px solid rgba(0,0,0,0.1)",
						cursor: "grab",
					}}
				>
					{item}
				</ReorderItem>
			{/each}
			{#if paddingBottom > 0}
				<li style="height: {paddingBottom}px; padding: 0px; border: none"></li>
			{/if}
		</ReorderGroup>
	</div>
	<!-- Expose state for Cypress assertions -->
	<p id="item-count" data-count={items.length}>
		{items.length} items
	</p>
	<p id="item-order" data-order={JSON.stringify(items)}>
		{items.join(", ")}
	</p>
	<p id="visible-count" data-count={virtualItems.length}>
		{virtualItems.length} visible
	</p>
</div>
