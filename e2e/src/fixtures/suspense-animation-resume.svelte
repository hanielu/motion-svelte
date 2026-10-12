<script lang="ts">
	import { motion } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Test component that verifies motion values are reset to initial values
	 * after a Suspense unmount/remount cycle (issue #2269).
	 *
	 * Timeline:
	 *   0ms   - Animation starts (opacity 0 → 1, scale 0.5 → 2)
	 *   400ms - Component suspends mid-animation
	 *   900ms - Component resumes, values should reset to initial
	 *
	 * motion-sv: Svelte has no <Suspense>. `{#await}` swaps the child for the fallback and remounts it afterwards,
	 * whereas React keeps the suspended instance (hidden, effects torn down) and resumes it.
	 */
	let promise = $state<null | Promise<void>>(null);
	let hasSuspended = false;

	onMount(() => {
		if (hasSuspended) return;

		const suspendTimeout = setTimeout(() => {
			hasSuspended = true;
			promise = new Promise((resolve) => {
				setTimeout(() => {
					resolve();
					promise = null;
				}, 500);
			});
		}, 400);

		return () => {
			clearTimeout(suspendTimeout);
		};
	});
</script>

{#await promise}
	<div id="fallback">Suspended</div>
{:then}
	<motion.div
		id="target"
		style={{
			width: 100,
			height: 100,
			background: "blue",
		}}
		initial={{ opacity: 0, scale: 0.5 }}
		animate={{ opacity: 1, scale: 2 }}
		transition={{ duration: 10 }}
	/>
{/await}
