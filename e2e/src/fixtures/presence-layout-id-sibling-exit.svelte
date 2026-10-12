<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion } from "motion-sv";

	// The playground's quillow card, reduced: when the collapsed view exits, the layoutId
	// avatar coming back in its place must stay visible.
	let expanded = $state(true);
	const layout = createLayoutMotion();
</script>

<button id="toggle" onclick={layout.update.with(() => (expanded = !expanded))}>Toggle</button>
<AnimatePresence mode="popLayout" initial={false}>
	{#if expanded}
		<motion.div id="list" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
			<layout.div id="avatar" layoutId="avatar" style={{ width: 50, height: 50, background: "pink" }} />
		</motion.div>
	{:else}
		<layout.div id="collapsed" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>Collapsed</layout.div>
	{/if}
</AnimatePresence>
