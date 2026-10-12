<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion } from "motion-sv";

	let showChild = $state(true);

	// Upstream's inner <Component> state.
	let showInnerChild = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

<button id="outer" onclick={() => (showChild = !showChild)}>Toggle outer child</button>
<AnimatePresence initial={false}>
	{#if showChild}
		<motion.div id="box" exit={{ opacity: 0 }} style={{ width: 200, height: 200, background: "red" }}>
			<motion.div>
				<button id="inner" onclick={layout.update.with(() => (showInnerChild = !showInnerChild))}>Toggle</button>
				{#if showInnerChild}
					<layout.div>Hello</layout.div>
				{/if}
			</motion.div>
		</motion.div>
	{/if}
</AnimatePresence>
