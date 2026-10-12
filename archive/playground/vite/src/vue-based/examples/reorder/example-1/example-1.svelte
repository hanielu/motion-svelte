<script lang="ts">
	import { ReorderGroup } from "motion-sv";
	import Item from "./item.svelte";

	const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];
	let items = $state(initialItems);
</script>

<ReorderGroup bind:values={items} axis="y" class="relative w-300px">
	{#each items as item, idx (item)}
		<Item {item} />
	{/each}
</ReorderGroup>
