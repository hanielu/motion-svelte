<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let show = $state(true);
	let exitCompleteCount = $state(0);
</script>

<button id="toggle" onclick={() => (show = false)}>Toggle section</button>
<span id="exit-complete-count">{exitCompleteCount}</span>
<AnimatePresence onExitComplete={() => (exitCompleteCount += 1)}>
	{#if show}
		<motion.section id="section" exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
			<!-- motion-sv: AnimatePresence has no `propagate` prop. -->
			<AnimatePresence>{null}</AnimatePresence>
		</motion.section>
	{/if}
</AnimatePresence>
