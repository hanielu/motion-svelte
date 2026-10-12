<script lang="ts">
	import { createLayoutMotion, mix, motion, useAnimationFrame, useMotionValue } from "motion-sv";

	const transition = {
		default: { duration: 5 },
	};

	let state = $state(false);
	// Force animation frames to pull transform
	const opacity = useMotionValue(0);
	useAnimationFrame(() => opacity.set(mix(0.99, 1, Math.random())));

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	// The nested motion.div registers with the layout.div's scope, so it keeps layout="preserve-aspect".
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));
</script>

<layout.div
	style={state ? { width: 100, height: 200, background: "black" } : { width: 200, height: 200, background: "black" }}
>
	<motion.div
		id="a"
		layout="preserve-aspect"
		style={{
			position: "absolute",
			top: 100,
			left: 100,
			background: "red",
			width: state ? 100 : 200,
			height: 200,
			opacity,
		}}
		onclick={toggle}
		{transition}
	/>
</layout.div>
