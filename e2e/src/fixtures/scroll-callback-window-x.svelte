<script lang="ts">
	import { scroll } from "motion-sv";

	let progress = $state(0);

	$effect(() => {
		scroll((p: number) => (progress = p), { axis: "x" });
	});

	const spacer = "width: 100vw; height: 500px";
	const progressStyle = "position: fixed; top: 0px; left: 0px";
</script>

<div style="width: 400vw; display: flex; flex-direction: row">
	<div style="{spacer}; background-color: red"></div>
	<div style="{spacer}; background-color: green"></div>
	<div style="{spacer}; background-color: blue"></div>
	<div style="{spacer}; background-color: yellow"></div>
	<div id="progress" style={progressStyle}>{progress}</div>
	<style>
		body {
			overflow-x: scroll !important;
			overflow-y: hidden;
		}
	</style>
</div>
