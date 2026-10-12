<script lang="ts">
	import { motion, useMotionValue, type MotionValue } from "motion-sv";

	/**
	 * This demo copies the rough setup of a nested Scroll/Page
	 * combo in Framer.
	 */

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const dummyX = useMotionValue(0);
	const dummyY = useMotionValue(0);

	const scrollContainer = {
		position: "absolute",
		top: 100,
		left: 100,
		width: 200,
		height: 500,
		overflow: "hidden",
	};

	const pageContainer = {
		display: "flex",
		flexDirection: "row",
		width: 180,
		height: 180,
		position: "relative",
		top: 300,
		left: 10,
	};

	const box = {
		background: "#ff0055",
	};

	const b = {
		...box,
		top: 100,
		left: 100,
		width: "100%",
		height: 500,
		borderRadius: 10,
	};

	const c = {
		position: "relative",
		top: 50,
		left: 50,
		width: 100,
		height: 100,
		background: "#ffaa00",
		borderRadius: 10,
	};
</script>

{#snippet Page(x: MotionValue<number>, y: MotionValue<number>, id?: string)}
	<motion.div
		layout
		_dragX={x}
		_dragY={y}
		{id}
		drag="x"
		style={{
			width: 180,
			height: 180,
			background: "#ffcc00",
			borderRadius: 10,
			flex: "0 0 180px",
		}}
	>
		<motion.div layout style={c} />
	</motion.div>
{/snippet}

<motion.div style={scrollContainer} layout>
	<motion.div id="parent" style={b} drag="y" _dragX={dummyX} _dragY={dummyY}>
		<motion.div style={{ ...pageContainer, x, y }} layout id="Page">
			{@render Page(x, y, "a")}
			{@render Page(x, y, "b")}
			{@render Page(x, y)}
			{@render Page(x, y)}
		</motion.div>
	</motion.div>
</motion.div>
