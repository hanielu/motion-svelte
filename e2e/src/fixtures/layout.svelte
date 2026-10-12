<script lang="ts">
	import { createLayoutMotion, useMotionValue } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let state = $state(true);
	const backgroundColor = useMotionValue("red");

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));

	const box = {
		position: "absolute",
		top: 0,
		left: 0,
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 200,
	};

	const b = {
		...box,
		top: 100,
		left: 200,
		width: 300,
		height: 300,
	};
</script>

<layout.div
	id="box"
	data-testid="box"
	layout={type}
	style={{ ...(state ? a : b), backgroundColor }}
	onclick={toggle}
	transition={{ duration: 0.5, ease: () => 0.5 }}
	onLayoutAnimationStart={() => backgroundColor.set("green")}
	onLayoutAnimationComplete={() => backgroundColor.set("blue")}
/>
