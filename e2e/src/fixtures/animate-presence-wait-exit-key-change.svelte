<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	/**
	 * mode="wait" where the key changes again at the moment the exiting child
	 * finishes its exit, with no transitions involved.
	 */
	let count = $state(0);
	let armed = false;
</script>

<div>
	<button
		id="next"
		onclick={() => {
			armed = true;
			count = 1;
		}}
	>
		next
	</button>
	<p id="state">{count}</p>
	<AnimatePresence mode="wait" initial={false}>
		<!-- React's key={count}: a keyed each keeps the value each child rendered with, like its React props. -->
		{#each [count] as key (key)}
			<motion.div
				id={`child-${key}`}
				class="child"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.1 }}
				onAnimationComplete={() => {
					if (key === 0 && armed) {
						armed = false;
						count = 2;
					}
				}}
			>
				{key}
			</motion.div>
		{/each}
	</AnimatePresence>
</div>
