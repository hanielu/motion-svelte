<script lang="ts">
	import { animate, motion, useMotionValue, useTransform, type PanInfo } from "motion-sv";

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-200, 200], [-20, 20]);

	let offset = $state({ x: 0, y: 0 });

	function onPan(_event: PointerEvent, info: PanInfo) {
		offset = info.offset;
		x.set(info.offset.x);
	}

	function onPanEnd() {
		animate(x, 0, { type: "spring", bounce: 0.4 });
	}
</script>

<div class="pan-demo">
	<motion.div class="card" style={{ x, rotate }} {onPan} {onPanEnd}>Pan me</motion.div>
	<p>offset: {Math.round(offset.x)}, {Math.round(offset.y)}</p>
</div>

<style>
	.pan-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.pan-demo :global(.card) {
		display: grid;
		place-items: center;
		width: 140px;
		height: 180px;
		border-radius: 20px;
		background: #ff0088;
		color: white;
		font-weight: 600;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
	}
</style>
