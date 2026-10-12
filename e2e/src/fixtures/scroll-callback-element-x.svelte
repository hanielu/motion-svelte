<script lang="ts">
	import { scroll } from "motion-sv";

	const width = 400;

	let progress = $state(0);
	let ref = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;
		return scroll(
			(latest: number) => {
				console.log(latest);
				progress = latest;
			},
			{ source: ref, axis: "x" }
		);
	});

	const spacer = `width: ${width}px; height: 200px; flex: 0 0 ${width}px`;
	const progressStyle = "position: fixed; top: 0px; left: 0px";
</script>

<div
	id="scroller"
	bind:this={ref}
	style="height: 200px; width: {width}px; overflow: scroll; display: flex; flex-direction: row"
>
	<div style="{spacer}; background-color: red"></div>
	<div style="{spacer}; background-color: green"></div>
	<div style="{spacer}; background-color: blue"></div>
	<div style="{spacer}; background-color: yellow"></div>
	<div id="progress" style={progressStyle}>{progress}</div>
</div>
