<script lang="ts">
	import { animateMini } from "motion-sv";
	import { onMount } from "svelte";

	let ref = $state<HTMLDivElement>();

	onMount(() => {
		if (!ref) return;

		const animation = animateMini(ref, { width: 200 }, { duration: 0.1 });

		animation.pause();
		animation.play();

		return () => animation.cancel();
	});
</script>

<div id="box" bind:this={ref} style="width: 100px; height: 100px; background-color: #fff"></div>
