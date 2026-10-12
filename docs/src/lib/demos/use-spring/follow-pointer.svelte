<script lang="ts">
	import { motion, useMotionValue, useSpring } from "motion-sv";

	const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const x = useSpring(pointerX, spring);
	const y = useSpring(pointerY, spring);

	let width = $state(0);
	let height = $state(0);

	function follow(event: PointerEvent) {
		pointerX.set(event.offsetX - width / 2);
		pointerY.set(event.offsetY - height / 2);
	}
</script>

<div class="stage" role="presentation" bind:clientWidth={width} bind:clientHeight={height} onpointermove={follow}>
	<motion.div class="ball" style={{ x, y }} />
</div>

<style>
	.stage {
		display: grid;
		place-items: center;
		width: min(100%, 560px);
		height: 240px;
		border-radius: 20px;
		background: rgb(255 0 136 / 0.08);
	}

	.stage :global(.ball) {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #ff0088;
		pointer-events: none;
	}
</style>
