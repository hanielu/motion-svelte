<script lang="ts">
	import { animate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Test for #3102 — filter blur animation should work correctly.
	 *
	 * Tests valid filter blur animations and verifies that
	 * re-animating (simulating HMR) works without issues.
	 */
	let ref = $state<HTMLDivElement>();
	let done = $state(false);
	let reanimated = $state(false);

	onMount(() => {
		const el = ref;
		if (!el) return;

		// First animation: blur(10px) → blur(0px)
		const anim = animate(el, { filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.3 });

		anim.then(() => {
			done = true;

			// Re-animate (simulates HMR re-triggering the animation)
			const anim2 = animate(el, { filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.3 });

			anim2.then(() => (reanimated = true));
		});
	});
</script>

<div>
	<div id="box" bind:this={ref} style="width: 100px; height: 100px; background: red"></div>
	<p id="done">{String(done)}</p>
	<p id="reanimated">{String(reanimated)}</p>
</div>
