<script lang="ts">
	import { useAnimationFrame } from "motion-sv";

	let cube = $state<HTMLDivElement>();

	useAnimationFrame((t) => {
		if (!cube) return;

		const rotate = Math.sin(t / 10000) * 200;
		const y = (1 + Math.sin(t / 1000)) * -50;
		cube.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
	});
</script>

<div class="container">
	<div class="cube" bind:this={cube}>
		<div class="side front"></div>
		<div class="side left"></div>
		<div class="side right"></div>
		<div class="side top"></div>
		<div class="side bottom"></div>
		<div class="side back"></div>
	</div>
</div>

<style>
	.container {
		width: 200px;
		height: 200px;
		perspective: 800px;
	}

	.cube {
		position: relative;
		width: 200px;
		height: 200px;
		transform-style: preserve-3d;
	}

	.side {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: red;
		opacity: 0.6;
	}

	.front {
		transform: rotateY(0deg) translateZ(100px);
		background-color: #ff008844;
	}

	.right {
		transform: rotateY(90deg) translateZ(100px);
		background-color: #dd00ee44;
	}

	.back {
		transform: rotateY(180deg) translateZ(100px);
		background-color: #9911ff44;
	}

	.left {
		transform: rotateY(-90deg) translateZ(100px);
		background-color: #1e75f744;
	}

	.top {
		transform: rotateX(90deg) translateZ(100px);
		background-color: #0cdcf744;
	}

	.bottom {
		transform: rotateX(-90deg) translateZ(100px);
		background-color: #8df0cc44;
	}
</style>
