<script lang="ts">
	import { AnimatePresence, motion, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const count = useMotionValue(0);
	// React renders a MotionValue child as live text; Svelte needs a reactive read of it.
	const countText = useCurrentMotionValue(count);
	let state = $state(0);
</script>

<button
	id="switch"
	onclick={() => {
		state === 0 ? (state = 1) : (state = 0);
	}}
>
	Switch
</button>
<div>
	Animation count: <motion.span id="count">{countText.current}</motion.span>
</div>
<AnimatePresence initial={false}>
	{#key state}
		<motion.div
			id={state.toString()}
			class="item"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			onAnimationStart={() => {
				count.set(count.get() + 1);
			}}
		>
			{state}
		</motion.div>
	{/key}
</AnimatePresence>
