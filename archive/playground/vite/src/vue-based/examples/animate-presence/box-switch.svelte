<script lang="ts">
	import { motion, MotionConfig, AnimatePresence } from "motion-sv";

	let value = $state(true);
</script>

<button onclick={() => (value = !value)}>
	Toggle value: {value}
</button>

<div class="relative flex h-full w-full items-center justify-center">
	<MotionConfig transition={{ type: "spring", duration: 2, bounce: 0 }}>
		<AnimatePresence mode="popLayout">
			{#if value}
				<motion.span
					initial={{ opacity: 0, x: -50, y: -50 }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					exit={{ opacity: 0, x: -50, y: -50 }}
					class="size-32 rounded-lg bg-amber-500/10 outline -outline-offset-1 outline-amber-500"
				/>
			{:else}
				<motion.span
					initial={{ opacity: 0, x: 50, y: 50 }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					exit={{ opacity: 0, x: 50, y: 50 }}
					class="size-48 rounded-lg bg-amber-500/10 outline -outline-offset-1 outline-amber-500"
				/>
			{/if}
		</AnimatePresence>
	</MotionConfig>
</div>
