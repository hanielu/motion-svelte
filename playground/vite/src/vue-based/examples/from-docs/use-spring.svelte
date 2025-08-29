<script lang="ts">
	import { motion, frame, useMotionValue, useSpring } from "motion-sve";

	const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

	// svelte-ignore non_reactive_update
	let element: HTMLDivElement = null!;
	const xPoint = useMotionValue(0);
	const yPoint = useMotionValue(0);
	const x = useSpring(xPoint, spring);
	const y = useSpring(yPoint, spring);

	const handlePointerMove = ({ clientX, clientY }: PointerEvent) => {
		if (!element) return;

		frame.read(() => {
			xPoint.set(clientX - element.offsetLeft - element.offsetWidth / 2);
			yPoint.set(clientY - element.offsetTop - element.offsetHeight / 2);
		});
	};

	$effect(() => {
		window.addEventListener("pointermove", handlePointerMove);
		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
		};
	});
</script>

<motion.div bind:ref={element} class="ball" style={{ x, y }} />

<style>
	:global(.ball) {
		width: 100px;
		height: 100px;
		background-color: #ff0088;
		border-radius: 50%;
	}
</style>
