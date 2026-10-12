<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const output: Array<string | number> = [];
	let ref = $state<HTMLElement | SVGElement | null>(null);
	let state = $state(true);
</script>

<div style="height: 100px; width: 100px; display: flex">
	<AnimatePresence>
		{#if state}
			<motion.div
				id="test"
				bind:ref
				initial={{ height: 0 }}
				animate={{ height: "auto" }}
				exit={{ height: 0 }}
				style={{ width: 100, background: "red" }}
				transition={{ duration: 0.1 }}
				onUpdate={({ height }) => {
					output.push(height);
				}}
				onAnimationComplete={() => {
					// Didn't animate properly
					if (output.length === 1) {
						ref!.innerHTML = "Error";
					}

					// Didn't apply "auto" as final style
					requestAnimationFrame(() => {
						if (ref?.style.height !== "auto") {
							ref!.innerHTML = "Error";
						}
					});
				}}
				onclick={() => (state = false)}
			/>
		{/if}
	</AnimatePresence>
</div>
