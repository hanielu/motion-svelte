<script lang="ts">
	import { scroll } from "motion-sv";

	const height = 400;

	let progress = $state(0);
	let ref = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;
		return scroll((p: number) => (progress = p), { source: ref });
	});

	const spacer = `height: ${height}px`;
	const progressStyle = "position: fixed; top: 0px; left: 0px";
</script>

<div id="scroller" bind:this={ref} style="width: 100px; height: {height}px; overflow: scroll">
	<div style="{spacer}; background-color: red"></div>
	<div style="{spacer}; background-color: green"></div>
	<div style="{spacer}; background-color: blue"></div>
	<div style="{spacer}; background-color: yellow"></div>
	<div id="progress" style={progressStyle}>{progress}</div>
</div>
