<script lang="ts">
	import { frameData, scroll } from "motion-sv";

	let progress = $state(0);
	let error = $state("");

	$effect(() => {
		let prevFrameStamp = 0;

		return scroll((p: number) => {
			progress = p;

			if (prevFrameStamp === frameData.timestamp) {
				error = "Concurrent event handlers detected";
			}

			prevFrameStamp = frameData.timestamp;
		});
	});

	const spacer = "height: 100vh";
	const progressStyle = "position: fixed; top: 0px; left: 0px";
	const errorStyle = "position: fixed; bottom: 0px; left: 0px";
</script>

<div style="{spacer}; background-color: red"></div>
<div style="{spacer}; background-color: green"></div>
<div style="{spacer}; background-color: blue"></div>
<div style="{spacer}; background-color: yellow"></div>
<div id="progress" style={progressStyle}>{progress}</div>
<div id="error" style={errorStyle}>{error}</div>
