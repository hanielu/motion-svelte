<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let visible = $state(true);
</script>

<button id="toggle" onclick={() => (visible = !visible)}>Toggle</button>
<AnimatePresence>
	{#if visible}
		<motion.div
			id="box"
			style={{ width: 100, height: 100, background: "red" }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		/>
	{/if}
</AnimatePresence>
