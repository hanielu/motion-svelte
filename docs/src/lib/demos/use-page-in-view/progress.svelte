<script lang="ts">
	import { useAnimate, usePageInView, type AnimationPlaybackControls } from "motion-sv";

	const pageInView = usePageInView();
	const [scope, animate] = useAnimate<HTMLDivElement>();

	let progress: AnimationPlaybackControls | undefined;

	$effect(() => {
		progress = animate(".fill", { scaleX: [0, 1] }, { duration: 5, ease: "linear", repeat: Infinity });
	});

	// Pause while the tab is hidden, so the bar picks up where it left off
	$effect(() => {
		if (pageInView.current) progress?.play();
		else progress?.pause();
	});
</script>

<div class="story" bind:this={scope.current}>
	<div class="track"><div class="fill"></div></div>
	<p>Switch to another tab and back. The bar pauses while the page is hidden.</p>
</div>

<style>
	.story {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: min(320px, 100%);
		padding: 16px;
		border-radius: 16px;
		background: rgb(255 0 136 / 0.12);
	}

	.track {
		height: 6px;
		border-radius: 3px;
		background: rgb(255 0 136 / 0.2);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		background: #ff0088;
		transform: scaleX(0);
		transform-origin: left;
	}

	p {
		margin: 0;
		font-size: 14px;
	}
</style>
