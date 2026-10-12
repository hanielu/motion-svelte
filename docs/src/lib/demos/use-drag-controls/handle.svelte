<script lang="ts">
	import { motion, useDragControls } from "motion-sv";

	const controls = useDragControls();

	let area = $state<HTMLElement>();
</script>

<div class="area" bind:this={area}>
	<motion.div class="card" drag dragControls={controls} dragListener={false} dragConstraints={area}>
		<div class="handle" role="presentation" onpointerdown={(event) => controls.start(event)}></div>
		<p>Drag me by the handle</p>
	</motion.div>
</div>

<style>
	.area {
		display: grid;
		place-items: center;
		width: min(560px, 100%);
		height: 220px;
		border-radius: 16px;
		background: rgb(255 0 136 / 0.08);
	}

	.area :global(.card) {
		width: 220px;
		border-radius: 12px;
		background: #ff0088;
		color: white;
		overflow: hidden;
	}

	.handle {
		height: 28px;
		background: rgb(0 0 0 / 0.2);
		cursor: grab;
		touch-action: none;
	}

	p {
		margin: 0;
		padding: 16px;
	}
</style>
