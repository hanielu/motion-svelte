<script lang="ts">
	import { stagger, useAnimate } from "motion-sv";

	const [scope, animate] = useAnimate<HTMLDivElement>();

	function play() {
		animate([
			[".fill", { scaleX: [0, 1] }, { duration: 0.8, ease: "easeInOut" }],
			[".dot", { scale: [0, 1] }, { delay: stagger(0.1), type: "spring", bounce: 0.5 }],
			[".label", { opacity: [0, 1], y: [8, 0] }, { at: "-0.2" }],
		]);
	}
</script>

<div class="sequence" bind:this={scope.current}>
	<div class="track"><div class="fill"></div></div>
	<div class="dots">
		<span class="dot"></span>
		<span class="dot"></span>
		<span class="dot"></span>
	</div>
	<p class="label">Done!</p>
	<button onclick={play}>Play sequence</button>
</div>

<style>
	.sequence {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		width: 240px;
	}

	.track {
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background: rgb(153 17 255 / 0.15);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		background: #9911ff;
		transform: scaleX(0);
		transform-origin: left;
	}

	.dots {
		display: flex;
		gap: 12px;
	}

	.dot {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #9911ff;
		transform: scale(0);
	}

	.label {
		margin: 0;
		font-weight: 600;
		opacity: 0;
	}

	button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: #9911ff;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
