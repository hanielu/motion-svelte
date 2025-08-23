<script lang="ts">
	import AnimatedList from "../shared/animated-list.svelte";
	import { css } from "runed";
	import { motion, createLayoutMotion } from "motion-rsv";

	const layout = createLayoutMotion(motion);
	const update = layout.update;
</script>

<AnimatedList title="Basic Layout List" {update}>
	{#snippet children({ filtered, styles, actions: { removeById } })}
		<motion.ul style={styles.list}>
			{#each filtered as item (item.id)}
				<layout.li
					style={styles.item}
					initial={{ opacity: 0, y: -8, scale: 0.98 }}
					animate={{
						opacity: 1,
						y: 0,
						scale: 1,
						transition: { type: "spring", stiffness: 500, damping: 30 },
					}}
				>
					<div style={css(styles.left)}>
						<div style={css(styles.handle)}></div>
						<div>
							<p style={css(styles.title)}>{item.text}</p>
							<span style={css(styles.small)}>id: {item.id}</span>
						</div>
					</div>
					<button
						style={css({ ...styles.ghostBtn, ...styles.danger })}
						onclick={update.with(() => removeById(item.id))}
					>
						Remove
					</button>
				</layout.li>
			{/each}
		</motion.ul>

		{#if filtered.length === 0}
			<motion.div style={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				Empty. Add an item or clear the filter.
			</motion.div>
		{/if}
	{/snippet}
</AnimatedList>
