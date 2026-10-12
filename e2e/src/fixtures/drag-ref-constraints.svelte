<script lang="ts">
	import { createLayoutMotion, motion, useMotionValue } from "motion-sv";

	// It's important for this test to only trigger a single rerender while dragging (in response to onDragStart) of draggable component.

	let containerRef = $state<HTMLElement | null>(null);
	let dragging = $state(false);
	const params = new URLSearchParams(window.location.search);
	const layout = params.get("layout") || undefined;

	// We do this to test when scroll position isn't 0/0
	$effect(() => {
		window.scrollTo(0, 100);
	});
	const x = useMotionValue("100%");

	/**
	 * SiblingLayoutAnimation: this sibling layout animation is designed to fuzz/stress the drag constraints
	 * measurements. Remeasuring the constraints during drag would previously mess
	 * up the position of the draggable element.
	 */
	let state = $state(false);
	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const siblingLayout = createLayoutMotion();

	$effect(() => {
		const current = state;
		const timer = setTimeout(() => {
			state = !current;
			siblingLayout.update();
		}, 200);

		return () => clearTimeout(timer);
	});
</script>

<div style="height: 2000px; padding-top: 100px">
	<motion.div data-testid="constraint" style={{ width: 200, height: 200, background: "blue" }} bind:ref={containerRef}>
		<motion.div
			id="box"
			data-testid="draggable"
			drag
			dragElastic={0}
			dragMomentum={false}
			style={{
				width: 50,
				height: 50,
				background: dragging ? "yellow" : "red",
				x,
			}}
			dragConstraints={containerRef ?? undefined}
			layout={layout as any}
			onDragStart={() => (dragging = true)}
			onDragEnd={() => (dragging = false)}
		/>
	</motion.div>
</div>
<siblingLayout.div
	layoutDependency={state}
	style={{
		width: 200,
		height: 200,
		borderRadius: 20,
		background: "blue",
		position: "relative",
		left: state ? "100px" : "0",
	}}
/>
