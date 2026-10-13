<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const initialOrder = ["#ff0088", "#dd00ee", "#9911ff", "#0d63f8"];

	const layout = createLayoutMotion();

	let order = $state([...initialOrder]);
	const reorder = layout.update.with(() => (order = shuffle(order)));

	$effect(() => {
		const intervalId = setInterval(reorder, 1000);
		return () => clearInterval(intervalId);
	});

	function shuffle([...array]: string[]) {
		return array.sort(() => Math.random() - 0.5);
	}

	const spring = { type: "spring", damping: 20, stiffness: 300 } as const;
</script>

<ul class="container">
	{#each initialOrder as backgroundColor (backgroundColor)}
		<layout.li transition={spring} style={{ backgroundColor, order: order.indexOf(backgroundColor) }} />
	{/each}
</ul>

<style>
	.container {
		position: relative;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 10px;
		width: 300px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.container :global(li) {
		width: 100px;
		height: 100px;
		border-radius: 10px;
	}
</style>
