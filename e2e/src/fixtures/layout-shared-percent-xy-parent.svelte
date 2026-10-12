<script lang="ts">
	import { createLayoutMotion, motion } from "motion-sv";

	/**
	 * Reproduction for #3254: layout animation breaks when nested
	 * in a parent motion.div with percentage x/y values.
	 */
	let selected = $state(0);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const setSelected = layout.update.with((index: number) => (selected = index));
</script>

<motion.div
	style={{
		x: "25%",
		y: "25%",
		width: 300,
	}}
>
	<div style="display: flex; height: 32px">
		{#each [0, 1, 2] as index (index)}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div id={`tab-${index}`} onclick={() => setSelected(index)} style="flex: 1; position: relative; cursor: pointer">
				{#if selected === index}
					<layout.div
						layoutId="indicator"
						id="indicator"
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							height: 4,
							background: "red",
						}}
						transition={{ duration: 10, ease: () => 0.5 }}
					/>
				{/if}
			</div>
		{/each}
	</div>
</motion.div>
