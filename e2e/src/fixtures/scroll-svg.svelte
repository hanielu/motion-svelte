<script lang="ts">
	import { motion, useCurrentMotionValue, useScroll } from "motion-sv";

	let rect = $state<any>(null);
	let svg = $state<any>(null);

	const rectValues = useScroll({
		get target() {
			return rect;
		},
		offset: ["start end", "end start"],
	});

	const svgValues = useScroll({
		get target() {
			return svg;
		},
		offset: ["start end", "end start"],
	});

	// motion-sv: a MotionValue can't be passed as children; render its latest value instead.
	const rectProgress = useCurrentMotionValue(rectValues.scrollYProgress);
	const svgProgress = useCurrentMotionValue(svgValues.scrollYProgress);

	const fixed = {
		position: "fixed",
		top: 10,
		left: 10,
	};
</script>

<div style="padding-top: 400px; padding-bottom: 400px">
	<svg bind:this={svg} viewBox="0 0 200 200" width="200" height="200">
		<rect bind:this={rect} width="100" height="100" x="50" y="50" fill="red" />
	</svg>
</div>
<motion.div style={{ ...fixed, color: "white" }} id="rect-progress">{rectProgress.current}</motion.div>
<motion.div style={{ ...fixed, top: 50, color: "white" }} id="svg-progress">{svgProgress.current}</motion.div>
