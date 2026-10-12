<script lang="ts">
	import { animateMini, stagger } from "motion-sv";
	import { onMount } from "svelte";

	onMount(() => {
		const controls = animateMini("#box", { opacity: [0, 1] }, { duration: 0.2, delay: stagger(0.5) });

		return () => controls.stop();
	});
</script>

<div style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<div id="box" style="width: 100px; height: 100px; background-color: red; opacity: 0"></div>
</div>
