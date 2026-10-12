<script lang="ts">
	import { motion, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const x = useMotionValue(0);
	const currentX = useCurrentMotionValue(x);
</script>

<div class="stack">
	<motion.div
		style={{ x, width: 80, height: 80, borderRadius: 20, background: "#0cdcf7", cursor: "grab" }}
		drag="x"
		dragConstraints={{ left: -150, right: 150 }}
	/>
	<output>x: {Math.round(currentX.current)}px</output>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	output {
		font-family: ui-monospace, monospace;
		font-variant-numeric: tabular-nums;
	}
</style>
