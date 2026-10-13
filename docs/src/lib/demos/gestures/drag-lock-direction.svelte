<script lang="ts">
	import { motion } from "motion-sv";

	let activeDirection = $state<"x" | "y" | null>(null);
</script>

{#snippet line(direction: "x" | "y")}
	<motion.div
		initial={false}
		animate={{ opacity: activeDirection === direction ? 1 : 0.3 }}
		transition={{ duration: 0.1 }}
		style={{ rotate: direction === "y" ? 90 : 0 }}
		class="guide"
	/>
{/snippet}

<div class="example">
	{@render line("x")}
	{@render line("y")}
	<motion.div
		drag
		dragDirectionLock
		onDirectionLock={(direction) => (activeDirection = direction)}
		onDragEnd={() => (activeDirection = null)}
		dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
		dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
		dragElastic={0.2}
		whileDrag={{ cursor: "grabbing" }}
		class="box"
	/>
</div>

<style>
	.example {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 300px;
		height: 300px;
	}

	.example :global(.box) {
		position: absolute;
		width: 52px;
		height: 52px;
		border: 1px solid currentColor;
		cursor: grab;
	}

	.example :global(.guide) {
		position: absolute;
		width: 300px;
		height: 1px;
		border-top: 1px dashed currentColor;
	}
</style>
