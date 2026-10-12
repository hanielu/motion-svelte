<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div
	style={{ width: 80, height: 80, background: "#9911ff" }}
	animate={{
		scale: [1, 1.6, 1.6, 1, 1],
		rotate: [0, 0, 180, 180, 0],
		borderRadius: ["0%", "0%", "50%", "50%", "0%"],
	}}
	transition={{
		duration: 2,
		ease: "easeInOut",
		times: [0, 0.2, 0.5, 0.8, 1],
		repeat: Infinity,
		repeatDelay: 1,
	}}
/>
