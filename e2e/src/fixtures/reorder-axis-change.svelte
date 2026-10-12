<script lang="ts">
	import { ReorderGroup, ReorderItem } from "motion-sv";

	const initialItems = ["Tomato", "Cucumber", "Cheese", "Lettuce"];

	/**
	 * Reproduces #3022: Reorder.Group stops working if axis changes
	 * after window resize (detected by matchMedia).
	 */
	let axis = $state<"x" | "y">("y");
	let items = $state(initialItems);

	$effect(() => {
		const media = window.matchMedia("(min-width: 500px)");
		const change = (event: MediaQueryListEvent) => {
			axis = event.matches ? "x" : "y";
		};
		// Set initial axis based on current width
		axis = media.matches ? "x" : "y";
		media.addEventListener("change", change);
		return () => media.removeEventListener("change", change);
	});
</script>

<div>
	<div id="current-order" data-testid="current-order">{items.join(",")}</div>
	<div id="current-axis" data-testid="current-axis">{axis}</div>
	<ReorderGroup
		as="div"
		{axis}
		values={items}
		onReorder={(newOrder) => (items = newOrder)}
		style={{
			display: "grid",
			gridAutoFlow: axis === "x" ? "column" : "row",
			gap: "10px",
			padding: "10px",
			listStyle: "none",
		}}
	>
		{#each items as item (item)}
			<ReorderItem
				as="div"
				value={item}
				data-testid={item}
				style={{
					padding: "20px",
					background: "#eee",
					cursor: "grab",
					minWidth: "80px",
					minHeight: "50px",
				}}
			>
				{item}
			</ReorderItem>
		{/each}
	</ReorderGroup>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 20px;
	}
</style>
