<script lang="ts">
	import { animate, animateMini, motion, scroll, useCurrentMotionValue, useMotionValue, useTransform } from "motion-sv";

	const progress = useMotionValue(0);

	$effect(() => {
		const stopScrollAnimation = scroll(
			animate("#color", {
				x: [0, 100],
				opacity: [0, 1],
				backgroundColor: ["#fff", "#000"],
			})
		);

		const stopMiniScrollAnimation = scroll(
			animateMini("#color", {
				color: ["#000", "#fff"],
			})
		);

		const stopMotionValueAnimation = scroll(animate(progress, 100));

		return () => {
			stopScrollAnimation();
			stopMiniScrollAnimation();
			stopMotionValueAnimation();
		};
	});

	const progressDisplay = useTransform(() => Math.round(progress.get()));
	// motion-sv: a MotionValue can't be passed as children; render its latest value instead.
	const display = useCurrentMotionValue(progressDisplay);

	const spacer = "height: 100vh";

	const progressStyle = {
		position: "fixed",
		top: 0,
		left: 0,
		width: 100,
		height: 100,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: 80,
		lineHeight: 80,
		fontWeight: "bold",
	};
</script>

<div style="{spacer}; background-color: red"></div>
<div style="{spacer}; background-color: green"></div>
<div style="{spacer}; background-color: blue"></div>
<div style="{spacer}; background-color: yellow"></div>
<motion.div id="color" style={progressStyle}>{display.current}</motion.div>
