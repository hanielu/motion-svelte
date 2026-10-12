<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const output: Array<string | number> = [];
	let ref = $state<HTMLElement | SVGElement | null>(null);
	let state = $state(true);
</script>

<div style="height: 100px; width: 200px; display: flex">
	<AnimatePresence>
		{#if state}
			<motion.div
				id="test"
				bind:ref
				animate={{ x: "100%", y: "100%", rotate: "-30deg" }}
				style={{ width: 200, background: "red" }}
				onclick={() => (state = false)}
				transition={{ duration: 2 }}
				onUpdate={({ x }) => {
					output.push(x);
				}}
				onAnimationComplete={() => {
					if (output[0] === "100%") {
						ref!.innerHTML = "Error";
					}
				}}
			/>
		{/if}
	</AnimatePresence>
</div>
