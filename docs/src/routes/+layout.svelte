<script lang="ts">
	import "@fontsource-variable/tasa-orbiter";
	import "@twinkleplop/theme-github";
	import favicon from "#lib/assets/favicon.svg";
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
