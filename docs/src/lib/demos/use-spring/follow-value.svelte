<script lang="ts">
	import { clamp, motion, useFollowValue, useMotionValue, useSpring } from "motion-sv";

	const pointer = useMotionValue(0);
	const spring = useSpring(pointer, { stiffness: 300, damping: 20 });
	const tween = useFollowValue(pointer, { type: "tween", ease: "easeOut" });

	let width = $state(0);

	// Centers the 40px dots on the pointer, within the stage
	const follow = (event: PointerEvent) => pointer.set(clamp(0, width - 40, event.offsetX - 20));
</script>

<div class="stage" role="presentation" bind:clientWidth={width} onpointermove={follow}>
	<div class="row">
		<motion.div class="dot pointer" style={{ x: pointer }} />
		<span>pointer</span>
	</div>
	<div class="row">
		<motion.div class="dot" style={{ x: spring, background: "#ff0088" }} />
		<span>useSpring</span>
	</div>
	<div class="row">
		<motion.div class="dot" style={{ x: tween, background: "#9911ff" }} />
		<span>useFollowValue, tween</span>
	</div>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: min(100%, 560px);
		padding: 16px 0;
		border-radius: 20px;
		background: rgb(153 17 255 / 0.08);
		cursor: crosshair;
	}

	.row {
		position: relative;
		height: 40px;
		pointer-events: none;
	}

	span {
		position: absolute;
		top: 50%;
		right: 16px;
		font-family: ui-monospace, monospace;
		font-size: 13px;
		opacity: 0.6;
		transform: translateY(-50%);
	}

	.stage :global(.dot) {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.stage :global(.pointer) {
		box-shadow: inset 0 0 0 3px currentColor;
	}
</style>
