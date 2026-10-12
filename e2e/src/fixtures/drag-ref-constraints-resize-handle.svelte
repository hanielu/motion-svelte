<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Test page for issue #2903: Drag constraints should update when the
	 * draggable element is resized. Mirrors the CodeSandbox reproduction
	 * which uses an externally-resizable modal (e.g. CSS `resize: both`
	 * or imperative DOM resizing) where React state never changes.
	 *
	 * Container: 500x500
	 * Draggable: starts at 100x100. Clicking the resize button mutates the
	 * element's inline style directly — bypassing React state — so the only
	 * signal that the size changed is ResizeObserver (matching the native
	 * CSS resize-handle behaviour described in the issue).
	 */
	let constraintsRef = $state<HTMLElement | SVGElement | null>(null);
	let boxRef = $state<HTMLElement | SVGElement | null>(null);

	const onResize = () => {
		if (boxRef) {
			boxRef.style.width = "300px";
			boxRef.style.height = "300px";
		}
	};
</script>

<div style="padding: 0; margin: 0">
	<button id="resize-trigger" onclick={onResize} style="position: fixed; top: 10px; right: 10px; z-index: 10">
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
			bind:ref={boxRef}
			drag
			dragConstraints={constraintsRef as HTMLElement}
			dragElastic={0}
			dragMomentum={false}
			style={{
				width: 100,
				height: 100,
				background: "red",
			}}
		/>
	</motion.div>
</div>
