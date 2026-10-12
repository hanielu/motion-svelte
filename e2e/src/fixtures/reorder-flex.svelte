<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	type FlexLayout = "row" | "column" | "wrap" | "wrap-rtl";

	const initialItems = ["a", "b", "c", "d"];

	let items = $state(initialItems);
	const layout = new URL(window.location.href).searchParams.get("layout") as FlexLayout;
</script>

<div data-testid="current-order">{items.join(",")}</div>
<ReorderGroup
	as="div"
	values={items}
	onReorder={(newOrder) => (items = newOrder)}
	style={{
		display: "flex",
		direction: layout === "wrap-rtl" ? "rtl" : "ltr",
		flexDirection: layout === "column" ? "column" : "row",
		flexWrap: layout.startsWith("wrap") ? "wrap" : "nowrap",
		gap: 20,
		width: layout.startsWith("wrap") ? 180 : "auto",
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
				flex: "0 0 80px",
				height: 80,
				justifyContent: "center",
			}}
		>
			{item}
		</ReorderItem>
	{/each}
</ReorderGroup>
