<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div
	style={{ width: 100, height: 100, backgroundColor: "#0cdcf7", borderRadius: 5 }}
	whileHover={{
		scale: [null, 1.1, 1.6],
		transition: {
			duration: 0.5,
			times: [0, 0.6, 1],
			ease: ["easeInOut", "easeOut"],
		},
	}}
	transition={{
		duration: 0.3,
		ease: "easeOut",
	}}
/>
