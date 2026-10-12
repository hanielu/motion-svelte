<script lang="ts">
	import { motion, useMotionValue, useSpring } from "motion-sv";

	let stage = $state<HTMLElement>();

	const dragX = useMotionValue(0);
	const dragY = useMotionValue(0);
	const x = useSpring(dragX, { stiffness: 200, damping: 15 });
	const y = useSpring(dragY, { stiffness: 200, damping: 15 });
</script>

<div class="stage" bind:this={stage}>
	<motion.div class="follower" style={{ x, y }} />
	<motion.div
		class="handle"
		style={{ x: dragX, y: dragY }}
		drag
		dragConstraints={stage}
		dragElastic={0}
		dragMomentum={false}
	/>
</div>

<style>
	.stage {
		position: relative;
		display: grid;
		place-items: center;
		width: min(100%, 480px);
		height: 220px;
		border-radius: 20px;
		background: rgb(153 17 255 / 0.1);
	}

	.stage :global(.follower),
	.stage :global(.handle) {
		grid-area: 1 / 1;
		border-radius: 50%;
	}

	.stage :global(.follower) {
		width: 80px;
		height: 80px;
		background: #9911ff;
	}

	.stage :global(.handle) {
		width: 32px;
		height: 32px;
		border: 3px solid currentColor;
		cursor: grab;
	}
</style>
