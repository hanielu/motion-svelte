<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * An example of animating between different value types
	 */
	onMount(() => {
		animate("#box", { y: ["100%", 0] }, { duration: 10, ease: () => 0 });
	});
</script>

<div style="width: 100px; height: 100px; background: #ffaa00" id="box"></div>
