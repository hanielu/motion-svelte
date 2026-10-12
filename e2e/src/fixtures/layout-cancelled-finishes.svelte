<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isVisible = $state(true);
	// motion-sv has no useInstantLayoutTransition(): the state change runs without blocking the layout update.
	const startTransition = (callback: () => void) => callback();
</script>

<AnimatePresence>
	{#if isVisible}
		<motion.div
			onclick={() => startTransition(() => (isVisible = false))}
			data-testid="cancellable"
			style={{ height: 100 }}
		/>
	{/if}
</AnimatePresence>
