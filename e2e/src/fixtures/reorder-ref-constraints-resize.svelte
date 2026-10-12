<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	/**
	 * Issue #3823: Reorder.Items that have never been dragged shouldn't be
	 * offset when the window (and so the ref constraints) resizes.
	 */
	let containerRef = $state<HTMLUListElement>();
	let items = $state(["one", "two", "three", "four", "five"]);
	let selected = $state("one");
</script>

<ReorderGroup
	bind:ref={containerRef}
	axis="x"
	values={items}
	onReorder={(newOrder) => (items = newOrder)}
	style={{
		display: "flex",
		listStyle: "none",
		padding: 8,
		margin: 0,
	}}
>
	{#each items as item (item)}
		<ReorderItem
			value={item}
			id={item}
			dragConstraints={containerRef}
			style={{
				width: 80,
				height: 40,
				marginRight: 8,
				flexShrink: 0,
				background: selected === item ? "#bcd" : "#eee",
			}}
		>
			<button type="button" style="width: 100%; height: 100%" onclick={() => (selected = item)}>
				{item}
			</button>
		</ReorderItem>
	{/each}
</ReorderGroup>
<div id="selected">{selected}</div>
