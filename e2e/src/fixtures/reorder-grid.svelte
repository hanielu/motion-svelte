<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	const initialItems = ["a", "b", "c", "d"];

	let items = $state(initialItems);
</script>

<div data-testid="current-order">{items.join(",")}</div>
<ReorderGroup
	as="div"
	values={items}
	onReorder={(newOrder) => (items = newOrder)}
	style={{
		display: "grid",
		gridTemplateColumns: "100px 100px",
		gap: 10,
		width: 210,
	}}
>
	{#each items as item (item)}
		<ReorderItem
			as="div"
			value={item}
			data-testid={item}
			transition={{ duration: 0 }}
			style={{
				alignItems: "center",
				background: "#eee",
				display: "flex",
				height: 100,
				justifyContent: "center",
			}}
		>
			{item}
		</ReorderItem>
	{/each}
</ReorderGroup>
