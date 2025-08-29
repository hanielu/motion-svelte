<script lang="ts">
	import AnimatedList from "../shared/animated-list.svelte";
	import { css } from "runed";
	import { motion, createLayoutMotion, AnimatePresence } from "motion-sve";

	const layout = createLayoutMotion(motion);
	const update = layout.update;
</script>

<AnimatedList title="Enter Exit List" {update}>
	{#snippet children({ filtered, styles, content })}
		<ul style={css(styles.list)}>
			<AnimatePresence initial={false} mode="popLayout" onExitComplete={() => console.log("exit complete")}>
				{#each filtered as item, index (item.id)}
					<layout.li
						style={styles.item}
						initial={{ opacity: 0, y: -8, scale: 0.98 }}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
							transition: { type: "spring", stiffness: 500, damping: 30 },
						}}
						exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } }}
						data-title={item.text}
						data-length={filtered.length}
						layoutDependency={filtered.length}
					>
						{@render content(item)}
					</layout.li>
				{/each}
			</AnimatePresence>
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
