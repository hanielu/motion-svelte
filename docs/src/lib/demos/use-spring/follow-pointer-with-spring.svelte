<script lang="ts">
	import { frame, motion, useMotionValue, useSpring } from "motion-sv";

	const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

	const xPoint = useMotionValue(0);
	const yPoint = useMotionValue(0);
	const x = useSpring(xPoint, spring);
	const y = useSpring(yPoint, spring);

	function handlePointerMove({ clientX, clientY, currentTarget }: PointerEvent & { currentTarget: HTMLElement }) {
		frame.read(() => {
			// The ball rests in the middle of the area, so measure the pointer from there
			const { left, top, width, height } = currentTarget.getBoundingClientRect();
			xPoint.set(clientX - left - width / 2);
			yPoint.set(clientY - top - height / 2);
		});
	}
</script>

<div class="area" role="presentation" onpointermove={handlePointerMove}>
	<motion.div class="ball" style={{ x, y }} />
</div>

<style>
	.area {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 400px;
	}

	.area :global(.ball) {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #ff0088;
	}
</style>
