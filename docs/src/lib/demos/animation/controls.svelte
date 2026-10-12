<script lang="ts">
	import { motion, useAnimationControls } from "motion-sv";

	const controls = useAnimationControls();

	async function play() {
		await controls.start((i: number) => ({ x: 160, transition: { delay: i * 0.1 } }));
		await controls.start({ rotate: 90, borderRadius: "50%" });
		await controls.start({ x: 0, rotate: 0, borderRadius: "20%" });
	}
</script>

<div class="controls-demo">
	<div class="track">
		{#each [0, 1, 2] as i (i)}
			<motion.div class="box" custom={i} animate={controls} />
		{/each}
	</div>
	<div class="buttons">
		<button onclick={play}>Play</button>
		<button onclick={() => controls.stop()}>Stop</button>
	</div>
</div>

<style>
	.controls-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 260px;
	}

	.track {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.track :global(.box) {
		width: 50px;
		height: 50px;
		border-radius: 20%;
		background: #0cdcf7;
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: rgb(12 220 247 / 0.2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
</style>
