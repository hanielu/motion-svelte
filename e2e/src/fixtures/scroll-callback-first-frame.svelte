<script lang="ts">
	import { scroll } from "motion-sv";

	let progress = $state(0);

	$effect(() => {
		return scroll((p: number, info) => {
			console.log(p, info.y);
			progress = 2 - p;
		});
	});

	const spacer = "height: 100vh";
	const progressStyle = "position: fixed; top: 0px; left: 0px";
</script>

<div style="{spacer}; background-color: red"></div>
<div style="{spacer}; background-color: green"></div>
<div style="{spacer}; background-color: blue"></div>
<div style="{spacer}; background-color: yellow"></div>
<div id="progress" style={progressStyle}>{progress}</div>
