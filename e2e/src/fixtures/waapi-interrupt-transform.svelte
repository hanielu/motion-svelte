<script lang="ts">
	import { useAnimate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Test for issue #3569: useAnimate WAAPI mid-flight interruption
	 * causes one-frame jump to origin.
	 *
	 * Starts a transform animation, interrupts it mid-flight with a
	 * new target, and tracks the minimum translateX to detect any
	 * jump back to origin.
	 *
	 * Uses generous timings (2s duration, 500ms before tracking) to
	 * accommodate slow CI environments where the async keyframe
	 * resolver may take longer.
	 */
	const [scope, animate] = useAnimate();
	let result = $state("");
	let minLeft = Infinity;
	let startLeft = 0;
	let isTracking = false;

	onMount(() => {
		if (!scope.current) return;

		// Record the element's starting position
		startLeft = scope.current.getBoundingClientRect().left;

		let tracking = true;
		const track = () => {
			if (!tracking || !scope.current) return;
			if (isTracking) {
				const left = scope.current.getBoundingClientRect().left;
				minLeft = Math.min(minLeft, left);
			}
			requestAnimationFrame(track);
		};
		requestAnimationFrame(track);

		// Start animation: translateX from 0 to 200px over 2s (linear)
		animate(scope.current, { transform: "translateX(200px)" }, { duration: 2, ease: "linear" });

		// Start tracking at 500ms — even with a slow resolver (up to
		// 200ms), the element will be at (500-200)/2000 * 200 = 30px.
		const timer0 = setTimeout(() => {
			isTracking = true;
		}, 500);

		// At 800ms, interrupt with new target.
		// Element is at ~60-80px depending on resolver delay.
		const timer1 = setTimeout(() => {
			animate(scope.current, { transform: "translateX(400px)" }, { duration: 2, ease: "linear" });
		}, 800);

		// At 2000ms, report minimum position offset from start
		const timer2 = setTimeout(() => {
			tracking = false;
			const minOffset = minLeft - startLeft;
			result = String(Math.round(minOffset));
		}, 2000);

		return () => {
			tracking = false;
			clearTimeout(timer0);
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	});
</script>

<div bind:this={scope.current} id="box" style="width: 100px; height: 100px; background: red"></div>
<div id="result">{result}</div>
