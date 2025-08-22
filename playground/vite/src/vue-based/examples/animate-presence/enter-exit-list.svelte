<script lang="ts">
	import { motion, AnimatePresence } from "motion-sv";
	import { css } from "runed";
	import AnimatedList from "../shared/animated-list.svelte";
</script>

<AnimatedList title="Basic Layout List">
	{#snippet children({ key, items: filtered, styles, actions: { removeById } })}
		<ul style={css(styles.list)}>
			<!-- <AnimatePresence initial={false}> -->
			{#each filtered as item (item.id)}
				<motion.li
					style={styles.item}
					initial={{ opacity: 0, y: -8, scale: 0.98 }}
					animate={{
						opacity: 1,
						y: 0,
						scale: 1,
						transition: { type: "spring", stiffness: 500, damping: 30 },
					}}
					exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } }}
					layout
					layoutDependency={key}
				>
					<div style={css(styles.left)}>
						<div style={css(styles.handle)}></div>
						<div>
							<p style={css(styles.title)}>{item.text}</p>
							<span style={css(styles.small)}>id: {item.id}</span>
						</div>
					</div>
					<button style={css({ ...styles.ghostBtn, ...styles.danger })} onclick={() => removeById(item.id)}>
						Remove
					</button>
				</motion.li>
			{/each}
			<!-- </AnimatePresence> -->
		</ul>

		<AnimatePresence>
			{#if filtered.length === 0}
				<motion.div style={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					Empty. Add an item or clear the filter.
				</motion.div>
			{/if}
		</AnimatePresence>
	{/snippet}
</AnimatedList>
