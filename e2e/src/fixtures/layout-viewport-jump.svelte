<script lang="ts">
	/**
	 * This test is designed to run at the Cypress default of 1000x660
	 * It is scripted to scroll down 100px before triggering the layout change
	 */
	import { createLayoutMotion, motion } from "motion-sv";

	let state = $state(true);
	const params = new URLSearchParams(window.location.search);
	const nested = params.get("nested") || false;

	const layout = createLayoutMotion();

	const scrollable = {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		height: 500,
		overflow: "scroll",
	} as any;

	const box = {
		width: 100,
		height: 100,
		borderRadius: 10,
		backgroundColor: "#ffaa00",
	};
</script>

{#snippet content()}
	<div
		style="margin-top: 100px; display: flex; justify-content: center; align-items: flex-start; height: {state
			? '1000px'
			: 'auto'}"
	>
		<layout.div
			id="box"
			layoutDependency={state}
			style={box}
			onclick={layout.update.with(() => (state = !state))}
			transition={{ ease: () => 0.1 }}
		/>
	</div>
{/snippet}

{#if nested}
	<motion.div layoutScroll id="scrollable" style={scrollable}>
		{@render content()}
	</motion.div>
{:else}
	{@render content()}
{/if}
