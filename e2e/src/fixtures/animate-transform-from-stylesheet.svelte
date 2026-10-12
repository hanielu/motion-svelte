<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	let ref = $state<HTMLDivElement>();

	onMount(() => {
		const animation = animate(ref!, { x: 200 }, { duration: 10, ease: "linear" });
		return () => animation.stop();
	});
</script>

{@render StyleSheet()}
<div id="box" bind:this={ref} style="width: 10px; height: 10px"></div>

{#snippet StyleSheet()}
	<style>
		#box {
			transform: translateX(100px);
		}
	</style>
{/snippet}
