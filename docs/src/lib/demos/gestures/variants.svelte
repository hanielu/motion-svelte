<script lang="ts">
	import { motion, type Variants } from "motion-sv";

	const button: Variants = {
		rest: { scale: 1 },
		hover: { scale: 1.05 },
		press: { scale: 0.95 },
	};

	const arrow: Variants = {
		rest: { x: 0 },
		hover: { x: 6 },
		press: { x: 12 },
	};
</script>

<motion.button
	style={{
		display: "flex",
		alignItems: "center",
		gap: 8,
		padding: "12px 24px",
		border: "none",
		borderRadius: 999,
		background: "#ff3e00",
		color: "white",
		fontSize: 16,
		fontWeight: 600,
		cursor: "pointer",
	}}
	variants={button}
	initial="rest"
	whileHover="hover"
	whilePress="press"
>
	Continue
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
		<motion.path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" variants={arrow} />
	</svg>
</motion.button>
