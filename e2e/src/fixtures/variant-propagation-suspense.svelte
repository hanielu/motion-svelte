<script lang="ts">
	import { motion } from "motion-sv";
	import { onMount } from "svelte";

	const childVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 2 } },
	};

	// Simulate a lazy-loaded child — module load takes ~100ms. React.lazy + <Suspense> maps to `{#await}`.
	const loadChild = () => new Promise<void>((resolve) => setTimeout(resolve, 100));

	const parentVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 2 } },
	};

	let show = $state(false);

	// Defer to trigger enter animation rather than appear
	onMount(() => {
		show = true;
	});
</script>

<div>
	{#if show}
		<motion.div id="parent" initial="hidden" animate="visible" variants={parentVariants}>
			{#await loadChild()}
				<div id="fallback">Loading...</div>
			{:then}
				<motion.div id="child" variants={childVariants} />
			{/await}
		</motion.div>
	{/if}
</div>
