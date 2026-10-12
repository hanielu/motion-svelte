<script lang="ts">
	import TabRow from "./tab-rows/tab-row.svelte";
</script>

<div class="rows">
	<TabRow id="fruit" tabs={["Apple", "Banana", "Cherry"]} />
	<TabRow id="vegetables" tabs={["Carrot", "Leek", "Pea"]} />
</div>

<style>
	.rows {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}
</style>
