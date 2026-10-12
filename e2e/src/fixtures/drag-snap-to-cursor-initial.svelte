<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	/**
	 * An element with initial x/y offsets, dragged via useDragControls with
	 * snapToCursor. Every drag start should centre the element under the pointer.
	 *
	 * With `?rerender=true`, each drag end updates state. React re-renders (and so re-measures) the element;
	 * Svelte only updates #trigger's attribute.
	 */
	const controls = useDragControls();
	let dragCount = $state(0);
	const rerender = new URLSearchParams(window.location.search).get("rerender") === "true";
</script>

<div
	id="trigger"
	data-drag-count={dragCount}
	onpointerdown={(event) => controls.start(event, { snapToCursor: true })}
	role="presentation"
	style="position: absolute; top: 0; left: 0; width: 400px; height: 400px; background: #eee"
></div>
<motion.div
	id="box"
	drag
	dragControls={controls}
	dragListener={false}
	dragMomentum={false}
	initial={{ x: 100, y: 40 }}
	onDragEnd={rerender ? () => (dragCount += 1) : undefined}
	style={{
		position: "absolute",
		top: 0,
		left: 500,
		width: 100,
		height: 100,
		background: "red",
	}}
/>
