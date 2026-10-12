<script lang="ts">
	import VueEntry from "./vue-based/entry.svelte";
	// import ReactEntry from "./react-based/entry.svelte";
</script>

<svelte:head>
	<title>Motion Svelte Playground</title>
</svelte:head>

<div class="h-screen w-screen overflow-hidden">
	<VueEntry />
</div>

<style>
	:global(html, body, #app) {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
