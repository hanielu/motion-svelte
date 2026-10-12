<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let show = $state(true);
	const params = new URLSearchParams(window.location.search);
	const withPadding = params.get("padding") === "true";
</script>

<div id="container" style="width: 400.4px; position: relative">
	<AnimatePresence mode="popLayout">
		{#if show}
			<motion.div
				id="child"
				initial={{ opacity: 1 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, transition: { duration: 10 } }}
				style={withPadding
					? {
							width: 200,
							padding: 20,
							borderWidth: 5,
							borderStyle: "solid",
							borderColor: "red",
							boxSizing: "content-box",
						}
					: undefined}
			>
				Content
			</motion.div>
		{/if}
	</AnimatePresence>
	<button id="toggle" onclick={() => (show = false)}>Toggle</button>
</div>
