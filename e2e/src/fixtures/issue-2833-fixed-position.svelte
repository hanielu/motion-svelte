<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Regression test for #2833.
	 *
	 * React-select with menuPosition="fixed" relies on the menu being positioned
	 * relative to the viewport, not to its ancestors. CSS spec: an ancestor with
	 * `transform`, `perspective`, `filter`, `backdrop-filter`, or `will-change`
	 * (containing those properties) establishes a containing block for fixed
	 * descendants — breaking that assumption.
	 *
	 * motion.div should not apply any of those by default, even when transform
	 * animations are configured via animate/whileHover/whilePress.
	 */
	const variant = new URLSearchParams(window.location.search).get("variant") ?? "plain";
</script>

{#snippet child()}
	<div id="fixed-child" style="position: fixed; top: 10px; left: 10px; width: 50px; height: 50px; background: red"></div>
{/snippet}

<div style="padding: 200px">
	{#if variant === "while-hover"}
		<motion.div id="parent" whileHover={{ scale: 1.1 }}>
			{@render child()}
		</motion.div>
	{:else if variant === "while-tap"}
		<motion.div id="parent" whilePress={{ scale: 0.9 }}>
			{@render child()}
		</motion.div>
	{:else if variant === "animate-transform"}
		<motion.div id="parent" animate={{ x: 0, y: 0 }}>
			{@render child()}
		</motion.div>
	{:else if variant === "initial-transform"}
		<motion.div id="parent" initial={{ scale: 1 }} animate={{ scale: 1 }}>
			{@render child()}
		</motion.div>
	{:else}
		<motion.div id="parent">{@render child()}</motion.div>
	{/if}
</div>
