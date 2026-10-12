<script lang="ts">
	import { animate, pipe } from "motion-sv";
	import { onMount } from "svelte";

	function testAnimation(selector: string, values: any) {
		const element = document.querySelector(selector);
		if (!element) return () => {};

		const animation = animate(element, values, { duration: 1, ease: "linear" });
		animation.time = 0.5;
		animation.pause();

		return () => animation.cancel();
	}

	onMount(() => {
		return pipe(
			testAnimation(".translate", { x: 200, y: 200 }),
			testAnimation(".rotate", { rotate: 100 }),
			testAnimation(".scale", { scale: 4 })
		) as () => void;
	});

	const box = "width: 100px; height: 100px; background: red";
</script>

<div>
	<div style="{box}; transform: translate(100px, 100px)" class="translate"></div>
	<div style="{box}; transform: rotate(90deg)" class="rotate"></div>
	<div style="{box}; transform: scale(2)" class="scale"></div>
</div>
