<script lang="ts">
	import { createLayoutMotion, useMotionValue } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let state = $state(true);
	const backgroundColor = useMotionValue("red");

	const layout = createLayoutMotion();

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
	layoutDependency={0}
	style={{ ...(state ? a : b), backgroundColor }}
	onclick={layout.update.with(() => (state = !state))}
	transition={{ duration: 0.15, ease: () => 0.5 }}
	onLayoutAnimationComplete={() => backgroundColor.set("blue")}
/>
