<script lang="ts">
	import { motion } from "motion-sv";
</script>

<motion.div
	style={{ width: 100, height: 100, backgroundColor: "#8df0cc", borderRadius: "50%" }}
	initial={{ opacity: 0, scale: 0 }}
	animate={{ opacity: 1, scale: 1 }}
	transition={{
		duration: 0.4,
		scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
	}}
/>
