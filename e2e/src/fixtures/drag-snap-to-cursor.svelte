<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	/**
	 * This is an example of triggering drag from an external element using useDragControls
	 */

	const container = "width: 200px; height: 200px; background: rgba(255,255,255,0.5); border-radius: 20px; margin: 20px";

	const child = {
		width: "50vw",
		height: 300,
		background: "white",
		borderRadius: 20,
	};

	const page =
		"position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: black; padding-top: 1000px; height: 100vh; display: flex";

	const dragControls = useDragControls();
</script>

<div style={page}>
	<div
		style={container}
		onpointerdown={(e) => dragControls.start(e, { snapToCursor: true })}
		id="scroll-trigger"
	></div>
	<motion.div drag {dragControls} whilePress={{ scale: 0.95 }} style={child} id="scrollable" />
</div>
