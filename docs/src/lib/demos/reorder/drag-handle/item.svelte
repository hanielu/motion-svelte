<script lang="ts">
	import { ReorderItem, useDragControls } from "motion-sv";

	let { item }: { item: string } = $props();

	const controls = useDragControls();
</script>

<ReorderItem value={item} dragListener={false} dragControls={controls}>
	{item}
	<div class="handle" onpointerdown={(event) => controls.start(event)} role="presentation">
		<svg viewBox="0 0 10 16" width="10" height="16" fill="currentColor">
			<circle cx="2" cy="2" r="1.5" />
			<circle cx="8" cy="2" r="1.5" />
			<circle cx="2" cy="8" r="1.5" />
			<circle cx="8" cy="8" r="1.5" />
			<circle cx="2" cy="14" r="1.5" />
			<circle cx="8" cy="14" r="1.5" />
		</svg>
	</div>
</ReorderItem>

<style>
	.handle {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		cursor: grab;
		touch-action: none;
	}

	.handle:hover {
		background: rgb(255 255 255 / 0.2);
	}
</style>
