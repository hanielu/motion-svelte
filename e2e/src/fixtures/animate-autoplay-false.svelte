<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	let ref = $state<HTMLDivElement>();
	let opacity = $state<string | null>(null);

	onMount(() => {
		if (!ref) return;
		const element = ref;

		const animation = animate(element, { opacity: 0.5 }, { duration: 10, autoplay: false });

		// Check opacity after a short delay to confirm it hasn't started
		const timer = setTimeout(() => {
			opacity = getComputedStyle(element).opacity;
		}, 100);

		return () => {
			animation.stop();
			clearTimeout(timer);
		};
	});
</script>

<div id="box" bind:this={ref} style="width: 100px; height: 100px; background-color: #fff; opacity: 1"></div>
<div id="opacity">{opacity}</div>
