<script lang="ts">
	import { useMotionValue, useTransform, motion } from "motion-sve";
	const x = useMotionValue(0);
	const xInput = [-100, 0, 100];
	const background = useTransform(x, xInput, [
		"linear-gradient(180deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
		"linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
		"linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)",
	]);
	const color = useTransform(x, xInput, ["rgb(211, 9, 225)", "rgb(68, 0, 255)", "rgb(3, 209, 0)"]);
	const tickPath = useTransform(x, [10, 100], [0, 1]);
	const crossPathA = useTransform(x, [-10, -55], [0, 1]);
	const crossPathB = useTransform(x, [-50, -100], [0, 1]);
</script>

<div>
	<motion.div class="container" style={{ background }}>
		<motion.div
			class="use-transform-box"
			style={{ x }}
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.5}
		>
			<svg class="progress-icon" viewBox="0 0 50 50">
				<motion.path
					fill="none"
					stroke-width="2"
					stroke={color}
					d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
					style={{ x: 5, y: 5 }}
				/>
				<motion.path
					id="tick"
					fill="none"
					stroke-width="2"
					stroke={color}
					d="M14,26 L 22,33 L 35,16"
					stroke-dasharray="0 1"
					style={{ pathLength: tickPath }}
				/>
				<motion.path
					fill="none"
					stroke-width="2"
					stroke={color}
					d="M17,17 L33,33"
					stroke-dasharray="0 1"
					style={{ pathLength: crossPathA }}
				/>
				<motion.path
					id="cross"
					fill="none"
					stroke-width="2"
					stroke={color}
					d="M33,17 L17,33"
					stroke-dasharray="0 1"
					style={{ pathLength: crossPathB }}
				/>
			</svg>
		</motion.div>
	</motion.div>
</div>

<style>
	:global {
		.use-transform-box {
			width: 140px;
			height: 140px;
			background-color: #f5f5f5;
			border-radius: 20px;
			padding: 20px;
		}

		.container {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			width: 500px;
			height: 300px;
			max-width: 100%;
			border-radius: 20px;
		}

		.progress-icon {
			width: 100%;
			height: 100%;
		}
	}
</style>
