<script lang="ts">
	import { motion, useMotionValue } from "motion-sv";

	/**
	 * An example of animating between different value types
	 */
	const params = new URLSearchParams(window.location.search);
	const isExternalMotionValue = params.get("use-motion-value") || false;
	// When roundtrip param is present, use a fast animation that completes (for testing calc -> 0 -> calc)
	const isRoundTrip = params.get("roundtrip") !== null;

	// motion-sv has no useCycle; cycle through the same values with state.
	const xValues: Array<number | string> = [0, "calc(3 * var(--width))"];
	let xIndex = $state(0);
	const x = $derived(xValues[xIndex]);
	const cycleX = () => (xIndex = (xIndex + 1) % xValues.length);

	const xMotionValue = useMotionValue(xValues[0]);
	const value = isExternalMotionValue ? xMotionValue : undefined;
</script>

<motion.div
	initial={false}
	animate={{ x }}
	transition={isRoundTrip ? { duration: 0.1 } : { duration: 5, ease: () => 0.5 }}
	style={{
		x: value,
		width: 100,
		height: 100,
		background: "#ffaa00",
		"--width": "100px",
	}}
	onclick={() => cycleX()}
	id="box"
/>
