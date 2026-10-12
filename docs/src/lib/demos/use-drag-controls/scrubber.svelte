<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	const controls = useDragControls();

	let track = $state<HTMLElement>();
</script>

<div class="track" role="presentation" bind:this={track} onpointerdown={(event) => controls.start(event, { snapToCursor: true })}>
	<motion.div
		class="thumb"
		drag="x"
		dragControls={controls}
		dragListener={false}
		dragConstraints={track}
		dragElastic={0}
		dragMomentum={false}
	/>
</div>

<style>
	.track {
		display: flex;
		align-items: center;
		width: min(400px, 100%);
		height: 40px;
		border-radius: 20px;
		background: rgb(153 17 255 / 0.15);
		cursor: pointer;
		touch-action: none;
	}

	.track :global(.thumb) {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #9911ff;
	}
</style>
