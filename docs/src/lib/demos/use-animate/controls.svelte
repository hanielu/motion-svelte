<script lang="ts">
	import { useAnimate, type AnimationPlaybackControls } from "motion-sv";

	const [scope, animate] = useAnimate<HTMLDivElement>();

	let animation: AnimationPlaybackControls | undefined;
	let isPlaying = $state(true);
	let isSlow = $state(false);

	$effect(() => {
		animation = animate(
			".ball",
			{ x: [-100, 100] },
			{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
		);
	});

	function togglePlay() {
		isPlaying = !isPlaying;
		if (isPlaying) animation?.play();
		else animation?.pause();
	}

	function toggleSpeed() {
		isSlow = !isSlow;
		if (animation) animation.speed = isSlow ? 0.25 : 1;
	}
</script>

<div class="controls" bind:this={scope.current}>
	<div class="ball"></div>
	<div class="buttons">
		<button class="toggle" onclick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
		<button class="speed" onclick={toggleSpeed}>{isSlow ? "Normal speed" : "Slow motion"}</button>
	</div>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}

	.ball {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #0cdcf7;
	}

	.buttons {
		display: flex;
		gap: 8px;
	}

	button {
		min-width: 120px;
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: rgb(12 220 247 / 0.2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
</style>
