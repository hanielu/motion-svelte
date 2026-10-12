<script lang="ts">
	import { browser } from "$app/env";

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.name} · motion-sv demos</title>
</svelte:head>

<!-- One demo on its own page, for testing and for viewing it full screen -->
<main>
	{#if browser}
		<data.component />
	{/if}
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		padding: 2rem;
		box-sizing: border-box;
	}
</style>
