<script lang="ts">
	import { motion } from "motion-sv";

	let direction = $state<"x" | "y" | null>(null);
</script>

<div class="lock-demo">
	<div class={["line", "x", { active: direction === "x" }]}></div>
	<div class={["line", "y", { active: direction === "y" }]}></div>
	<motion.div
		class="box"
		drag
		dragDirectionLock
		dragSnapToOrigin
		onDirectionLock={(axis) => (direction = axis)}
		onDragEnd={() => (direction = null)}
	/>
</div>

<style>
	.lock-demo {
		display: grid;
		place-items: center;
		width: 240px;
		height: 200px;
	}

	.line {
		grid-area: 1 / 1;
		border-radius: 2px;
		background: rgb(153 17 255 / 0.2);
		transition: background-color 0.2s;
	}

	.line.active {
		background: #9911ff;
	}

	.line.x {
		width: 100%;
		height: 4px;
	}

	.line.y {
		width: 4px;
		height: 100%;
	}

	.lock-demo :global(.box) {
		grid-area: 1 / 1;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #9911ff;
		cursor: grab;
	}
</style>
