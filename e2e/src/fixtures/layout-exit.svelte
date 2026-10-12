<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";
	import { untrack } from "svelte";

	let visible = $state(true);

	const layout = createLayoutMotion();

	const animation = {
		x: 0,
		opacity: 0.5,
	};

	$effect(() => {
		untrack(layout.update.with(() => (visible = !visible)));
	});
</script>

<AnimatePresence>
	{#if visible}
		<layout.div
			id="box"
			style={{ width: 100, height: 100, background: "blue" }}
			transition={{ duration: 0.1 }}
			exit={animation}
		/>
	{/if}
</AnimatePresence>
