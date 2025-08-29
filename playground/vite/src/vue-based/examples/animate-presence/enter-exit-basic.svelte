<script lang="ts">
	import { css } from "runed";
	import { AnimatePresence, motion } from "motion-sve";

	const container = {
		display: "flex",
		flexDirection: "column",
		width: 100,
		height: 160,
		position: "relative",
	};

	const box = {
		width: 100,
		height: 100,
		backgroundColor: "#0cdcf7",
		borderRadius: "10px",
	};

	const button = {
		backgroundColor: "#0cdcf7",
		borderRadius: "10px",
		padding: "10px 20px",
		color: "#0f1115",
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	};

	let isVisible = $state(true);
</script>

<div style={css(container)}>
	<AnimatePresence initial={false}>
		{#if isVisible}
			<motion.div
				initial={{ opacity: 0, scale: 0, rotate: 0 }}
				animate={{ opacity: 1, scale: 1, rotate: 45 }}
				exit={{ opacity: 0, scale: 0, rotate: 0 }}
				style={box}
				whileHover={{ scale: 1.1 }}
			/>
		{/if}
	</AnimatePresence>
	<motion.button style={button} onclick={() => (isVisible = !isVisible)} whilePress={{ y: 1 }}>
		{isVisible ? "Hide" : "Show"}
	</motion.button>
</div>
