<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Browsers flush a pending (coalesced) pointermove right before pointerup,
	 * so the final move and the release often arrive within the same frame.
	 * The element should come to rest at the release point, matching the
	 * offset reported to onDragEnd.
	 */
	let offset = $state("");
</script>

<div style="padding: 100px">
	<motion.div
		data-testid="draggable"
		drag
		dragElastic={0}
		dragMomentum={false}
		onDragEnd={(_, info) => (offset = `${info.offset.x},${info.offset.y}`)}
		style={{ width: 50, height: 50, background: "red" }}
	/>
	<div id="drag-end-offset">{offset}</div>
</div>
