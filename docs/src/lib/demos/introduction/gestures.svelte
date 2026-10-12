<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.button
	style={{
		padding: "12px 28px",
		border: "none",
		borderRadius: 999,
		background: "#ff3e00",
		color: "white",
		fontSize: 16,
		fontWeight: 600,
		cursor: "pointer",
	}}
	whileHover={{ scale: 1.1 }}
	whilePress={{ scale: 0.9 }}
>
	Press me
</motion.button>
