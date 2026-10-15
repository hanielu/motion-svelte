<script lang="ts">
	import { motion, useMotionValue, useSpring } from "motion-sv";

	// Motion values, not state: the dot follows the pointer without re-rendering anything
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const x = useSpring(pointerX, { stiffness: 220, damping: 18 });
	const y = useSpring(pointerY, { stiffness: 220, damping: 18 });

	function follow(event: PointerEvent) {
		const area = event.currentTarget as HTMLElement;
		const box = area.getBoundingClientRect();
		pointerX.set(event.clientX - box.left - box.width / 2);
		pointerY.set(event.clientY - box.top - box.height / 2);
	}

	function center() {
		pointerX.set(0);
		pointerY.set(0);
	}
</script>

<div class="area" role="presentation" onpointermove={follow} onpointerleave={center}>
	<motion.div class="dot" style={{ x, y }} />
</div>

<style>
	.area {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		touch-action: none;
	}

	.area :global(.dot) {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: #8df0cc;
		pointer-events: none;
	}
</style>
