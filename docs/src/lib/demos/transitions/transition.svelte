<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div
	style={{ width: 200, height: 200, borderRadius: "50%", background: "#ff0088" }}
	initial={{ opacity: 0, scale: 0.5 }}
	animate={{ opacity: 1, scale: 1 }}
	transition={{
		duration: 0.8,
		delay: 0.5,
		ease: [0, 0.71, 0.2, 1.01],
	}}
/>
