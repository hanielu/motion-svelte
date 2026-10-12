<script lang="ts">
	import { createLayoutMotion, type PanInfo } from "motion-sv";

	/**
	 * Regression test for issue #3315.
	 *
	 * Tiles use `drag` + `dragSnapToOrigin` + `layoutId` with absolute `top`/`left` positioning. When two
	 * same-row tiles swap, the dragged tile must not render at its new layout position PLUS the drag offset.
	 */

	const TILES_PER_ROW = 3;
	const TILE_SIZE = 60;
	const GRID_SIZE = TILE_SIZE * TILES_PER_ROW;

	type Position = { x: number; y: number };

	let tiles = $state.raw(
		Array.from({ length: TILES_PER_ROW }, (_, i) =>
			Array.from({ length: TILES_PER_ROW }, (_, j) => ({ id: i * TILES_PER_ROW + j }))
		)
	);
	// Per-tile `isDragging` state (React keeps it inside each <Tile>).
	let dragging = $state<Record<number, boolean>>({});

	// motion-sv: layoutId animations need createLayoutMotion + an explicit update after the state change.
	const layout = createLayoutMotion();

	function handleDragEnd(draggedPos: Position, info: PanInfo) {
		const dropX = draggedPos.x + Math.round(info.offset.x / TILE_SIZE);
		const dropY = draggedPos.y + Math.round(info.offset.y / TILE_SIZE);
		if (
			dropX < 0 ||
			dropX >= TILES_PER_ROW ||
			dropY < 0 ||
			dropY >= TILES_PER_ROW ||
			(draggedPos.x === dropX && draggedPos.y === dropY)
		) {
			return;
		}
		const newTiles = tiles.map((row) => [...row]);
		newTiles[dropY][dropX] = tiles[draggedPos.y][draggedPos.x];
		newTiles[draggedPos.y][draggedPos.x] = tiles[dropY][dropX];
		tiles = newTiles;
		layout.update();
	}
</script>

<div style="padding: 50px">
	<div
		id="grid"
		data-tile-state={tiles.map((row) => row.map((t) => t.id).join(",")).join("|")}
		style="border: solid 1px black; width: {GRID_SIZE}px; height: {GRID_SIZE}px; position: relative"
	>
		{#each tiles as r, y}
			{#each r as tile, x (tile.id)}
				<layout.div
					data-testid={`tile-${tile.id}`}
					style={{
						position: "absolute",
						border: "solid 1px black",
						width: TILE_SIZE,
						height: TILE_SIZE,
						top: y * TILE_SIZE,
						left: x * TILE_SIZE,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#fff",
						zIndex: dragging[tile.id] ? 1 : 0,
					}}
					layoutId={String(tile.id)}
					onAnimationComplete={() => (dragging[tile.id] = false)}
					onAnimationStart={() => (dragging[tile.id] = true)}
					drag
					dragSnapToOrigin
					onDragEnd={(_: PointerEvent, info: PanInfo) => handleDragEnd({ x, y }, info)}
					whileDrag={{ zIndex: 1 }}
				>
					{tile.id}
				</layout.div>
			{/each}
		{/each}
	</div>
</div>
