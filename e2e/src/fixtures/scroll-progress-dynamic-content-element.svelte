<script lang="ts">
	import { scroll } from "motion-sv";

	const height = 400;

	let progress = $state(0);
	let showExtraContent = $state(false);
	let ref = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;
		return scroll((p: number) => (progress = p), {
			source: ref,
			trackContentSize: true,
		});
	});

	$effect(() => {
		const timer = setTimeout(() => (showExtraContent = true), 500);
		return () => clearTimeout(timer);
	});

	const spacer = `height: ${height}px`;
	const progressStyle = "position: fixed; top: 0px; left: 0px";
	const loadedStyle = "position: fixed; top: 20px; left: 0px";
</script>

<div id="scroller" bind:this={ref} style="width: 100px; height: {height}px; overflow: scroll">
	<div style="{spacer}; background-color: red"></div>
	<div style="{spacer}; background-color: green"></div>
	{#if showExtraContent}
		<div id="extra-content" style="{spacer}; background-color: purple"></div>
		<div style="{spacer}; background-color: orange"></div>
	{/if}
	<div id="progress" style={progressStyle}>{progress.toFixed(4)}</div>
	<div id="content-loaded" style={loadedStyle}>{showExtraContent ? "loaded" : "loading"}</div>
</div>
