<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let count = $state(0);

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

<!-- motion-sv: layoutDependency gives the stay-mounted box a reactive trigger on every re-render, like React's. -->
<layout.div
	id="box"
	data-testid="box"
	layoutDependency={count}
	style={count === 0 ? a : b}
	onclick={layout.update.with(() => count++)}
	transition={{ duration: 10, ease: () => 0.5 }}
/>
