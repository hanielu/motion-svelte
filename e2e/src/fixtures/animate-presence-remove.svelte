<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	const boxStyles = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	let range = $state([0, 1, 2]);
</script>

<div style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<button id="remove" onclick={() => (range = range.slice(0, -1))}>Remove</button>
	<AnimatePresence>
		{#each range as i (i)}
			<motion.div id={`box-${i}`} class="box" style={boxStyles} transition={{ duration: 0.5 }} exit={{ opacity: 0.5 }} />
		{/each}
	</AnimatePresence>
</div>
