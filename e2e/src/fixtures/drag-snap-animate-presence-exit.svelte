<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	/**
	 * Companion to the #3315 fix: exercise drag + dragSnapToOrigin alongside AnimatePresence exit, proving exit
	 * animations still complete cleanly while a drag-driven motion-value animation is mid-flight during the unmount.
	 */

	const TILE_SIZE = 80;

	let show = $state(true);
</script>

<div style="padding: 60px">
	<button data-testid="toggle" onclick={() => (show = !show)} style="margin-bottom: 20px">toggle</button>
	<div id="container" data-show={show ? "1" : "0"} style="position: relative; width: 300px; height: 300px">
		<AnimatePresence>
			{#if show}
				<motion.div
					data-testid="tile"
					drag
					dragSnapToOrigin
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: TILE_SIZE,
						height: TILE_SIZE,
						background: "#08f",
					}}
				/>
			{/if}
		</AnimatePresence>
	</div>
</div>
