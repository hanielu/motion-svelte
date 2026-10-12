<script lang="ts">
	import { useAnimationFrame } from "motion-sv";

	let cube = $state<HTMLDivElement>();

	useAnimationFrame((time) => {
		if (!cube) return;

		// A full turn every 7.2 seconds, bobbing up and down every 2 seconds
		const angle = time / 20;
		const y = Math.sin((time / 2000) * Math.PI * 2) * 20;
		cube.style.transform = `translateY(${y}px) rotateX(${angle / 2}deg) rotateY(${angle}deg)`;
	});
</script>

<div class="scene">
	<div class="cube" bind:this={cube}>
		<div class="side front"></div>
		<div class="side back"></div>
		<div class="side left"></div>
		<div class="side right"></div>
		<div class="side top"></div>
		<div class="side bottom"></div>
	</div>
</div>

<style>
	.scene {
		perspective: 800px;
	}

	.cube {
		position: relative;
		width: 120px;
		height: 120px;
		transform-style: preserve-3d;
	}

	.side {
		position: absolute;
		inset: 0;
		opacity: 0.6;
	}

	.front {
		background: #ff0088;
		transform: rotateY(0deg) translateZ(60px);
	}

	.right {
		background: #dd00ee;
		transform: rotateY(90deg) translateZ(60px);
	}

	.back {
		background: #9911ff;
		transform: rotateY(180deg) translateZ(60px);
	}

	.left {
		background: #0d63f8;
		transform: rotateY(-90deg) translateZ(60px);
	}

	.top {
		background: #0cdcf7;
		transform: rotateX(90deg) translateZ(60px);
	}

	.bottom {
		background: #8df0cc;
		transform: rotateX(-90deg) translateZ(60px);
	}
</style>
