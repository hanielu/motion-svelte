<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-sv";

	/**
	 * Test page for issue #2458: Drag constraints should update when
	 * the draggable element's dimensions change.
	 *
	 * Container: 500x500, positioned at top-left
	 * Draggable: starts at 100x100, can be resized to 300x300
	 *
	 * Before resize: constraints allow 400px of travel (500 - 100)
	 * After resize: constraints should allow 200px of travel (500 - 300)
	 */
	let constraintsRef = $state<HTMLElement | SVGElement | null>(null);
	const widthMV = useMotionValue(100);
	const heightMV = useMotionValue(100);
	const width = useTransform(widthMV, (v) => `${v}px`);
	const height = useTransform(heightMV, (v) => `${v}px`);

	const handleResize = () => {
		widthMV.set(300);
		heightMV.set(300);
	};
</script>

<div style="padding: 0; margin: 0">
	<button id="resize-trigger" onclick={handleResize} style="position: fixed; top: 10px; right: 10px; z-index: 10">
		Resize to 300x300
	</button>
	<motion.div
		id="constraints"
		bind:ref={constraintsRef}
		style={{
			width: 500,
			height: 500,
			background: "rgba(0, 0, 255, 0.1)",
			position: "relative",
		}}
	>
		<motion.div
			id="box"
			data-testid="draggable"
			drag
			dragConstraints={constraintsRef as HTMLElement}
			dragElastic={0}
			dragMomentum={false}
			style={{
				width,
				height,
				background: "red",
			}}
		/>
	</motion.div>
</div>
