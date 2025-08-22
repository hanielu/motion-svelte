<script lang="ts">
	import { motion } from 'motion-sv';
	import { css } from 'runed';
	import AnimatedList from './shared/animated-list.svelte';
	import { untrack } from 'svelte';

	let ref: HTMLElement | SVGElement = null!;

	// const [layoutMotion, update] = createLayoutMotion(motion);
	const layoutMotion = motion;
	const update = () => {};
</script>

<AnimatedList title="Basic Layout List" {update}>
	{#snippet children({ filtered, styles, actions: { removeById } })}
		<layoutMotion.ul style={styles.list}>
			{#each filtered as item (item.id)}
				<motion.li
					style={styles.item}
					initial={{ opacity: 0, y: -8, scale: 0.98 }}
					animate={{
						opacity: 1,
						y: 0,
						scale: 1,
						transition: { type: 'spring', stiffness: 500, damping: 30 },
					}}
					layout
					data-title={`${item.id}-${item.text}`}
					bind:ref={
						() => ref,
						(v) => {
							untrack(() => {
								if (item.id === 2) ref = v;
							});
						}
					}
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
						onclick={() => {
							removeById(item.id);
							console.log(item.text, ref.getBoundingClientRect());
							update();
						}}
					>
						Remove
					</button>
				</motion.li>
			{/each}
		</layoutMotion.ul>

		{#if filtered.length === 0}
			<motion.div style={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				Empty. Add an item or clear the filter.
			</motion.div>
		{/if}
	{/snippet}
</AnimatedList>
