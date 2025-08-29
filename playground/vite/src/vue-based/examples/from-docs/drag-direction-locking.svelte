<script lang="ts">
	import { motion } from "motion-sve";

	let activeDirection = $state<"x" | "y" | null>(null);
</script>

<div id="example" class="bg-black">
	{@render Line("x", activeDirection)}
	{@render Line("y", activeDirection)}
	<motion.div
		drag
		dragDirectionLock
		onDirectionLock={(e) => (activeDirection = e)}
		onDragEnd={() => (activeDirection = null)}
		dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
		dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
		dragElastic={0.2}
		whileDrag={{ cursor: "grabbing" }}
		class="box"
	/>
</div>

{#snippet Line(direction: "x" | "y", activeDirection: "x" | "y" | null)}
	<motion.div
		initial={false}
		animate={{ opacity: activeDirection === direction ? 1 : 0.3 }}
		transition={{ duration: 0.1 }}
		style={{ rotate: direction === "y" ? 90 : 0 }}
		class="line"
	/>
{/snippet}

<style>
	:global {
		#example {
			width: 300px;
			height: 300px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
		}

		.box {
			width: 52px;
			height: 52px;
			border: 1px solid #f5f5f5;
			position: absolute;
			cursor: grab;
		}

		.line {
			width: 300px;
			height: 1px;
			border-top: 1px dashed #f5f5f5;
			position: absolute;
		}
	}
</style>
