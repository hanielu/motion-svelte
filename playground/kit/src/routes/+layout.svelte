<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "uno.css";
	import "../app.css";
	import { browser } from "$app/environment";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Motion Svelte + SvelteKit Playground</title>
</svelte:head>

{#if browser}
	{@render children()}
{/if}
