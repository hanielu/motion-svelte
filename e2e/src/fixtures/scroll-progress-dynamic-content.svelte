<script lang="ts">
	import { scroll } from "motion-sv";

	let progress = $state(0);
	let showExtraContent = $state(false);

	$effect(() => {
		return scroll((p: number) => (progress = p), { trackContentSize: true });
	});

	$effect(() => {
		const timer = setTimeout(() => (showExtraContent = true), 500);
		return () => clearTimeout(timer);
	});

	const spacer = "height: 100vh";
	const progressStyle = "position: fixed; top: 0px; left: 0px";
</script>

<div style="{spacer}; background-color: red"></div>
<div style="{spacer}; background-color: green"></div>
{#if showExtraContent}
	<div id="extra-content" style="{spacer}; background-color: purple"></div>
	<div style="{spacer}; background-color: orange"></div>
{/if}
<div id="progress" style={progressStyle}>{progress.toFixed(4)}</div>
<div id="content-loaded">{showExtraContent ? "loaded" : "loading"}</div>
