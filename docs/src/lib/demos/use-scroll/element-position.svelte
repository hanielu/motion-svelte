<script lang="ts">
	import Item from "./element-position/item.svelte";

	let container = $state<HTMLElement>();
</script>

<div class="scroller" bind:this={container}>
	{#each { length: 6 }, i}
		<Item {container} label={`Item ${i + 1}`} />
	{/each}
</div>

<style>
	.scroller {
		/* A positioned container lets Motion measure where the items sit inside it */
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: min(100%, 420px);
		height: 240px;
		padding: 20px;
		overflow-y: auto;
		border-radius: 16px;
		background: rgb(12 220 247 / 0.08);
	}
</style>
