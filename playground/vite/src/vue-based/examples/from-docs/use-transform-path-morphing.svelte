<script lang="ts">
	import { interpolate, type Shape } from "flubber";
	import { motion, motionValue, useTransform, animate, MotionValue } from "motion-sve";

	/**
	 * ==============   Shape data   ================
	 */

	// Paths taken from https://github.com/veltman/flubber/blob/master/demos/basic-svg.html
	const star = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
	const heart =
		"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
	const hand =
		"M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z";
	const plane =
		"M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
	const lightning = "M7 2v11h3v9l7-12h-4l4-8z";
	const note = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";

	const paths = [lightning, hand, plane, heart, note, star, lightning];
	const colors = ["#fff312", "#ff0088", "#dd00ee", "#9911ff", "#0d63f8", "#0cdcf7", "#4ff0b7"];

	/**
	 * ==============   Utils   ================
	 */

	const getIndex = (_: string, index: number) => index;

	function useFlubber(progress: MotionValue<number>, paths: string[]) {
		return useTransform(progress, paths.map(getIndex), paths, {
			mixer: (a, b) => interpolate(a as Shape, b as Shape, { maxSegmentLength: 0.1 }),
		});
	}

	let pathIndex = $state(0);
	// svelte-ignore state_referenced_locally
	const progress = motionValue(pathIndex);
	const fill = useTransform(progress, paths.map(getIndex), colors);
	const path = useFlubber(progress, paths);

	$effect(() => {
		const newIndex = pathIndex;
		const animation = animate(progress, newIndex, {
			duration: 0.8,
			ease: "easeInOut",
			delay: 0.5,
			onComplete: () => {
				if (pathIndex === paths.length - 1) {
					progress.set(0);
					pathIndex = 1;
				} else {
					pathIndex += 1;
				}
			},
		});
		return () => animation.stop();
	});
</script>

<svg width="400" height="400">
	<g transform="translate(10 10) scale(17 17)">
		<motion.path {fill} d={path} />
	</g>
</svg>
