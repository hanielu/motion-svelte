<script lang="ts">
	import { motion } from "motion-sv";
</script>

<svg width="160" height="160" viewBox="0 0 160 160">
	<motion.circle
		cx="80"
		cy="80"
		r="64"
		fill="none"
		stroke="#ff0088"
		stroke-width="12"
		stroke-linecap="round"
		initial={{ pathLength: 0, opacity: 0 }}
		animate={{ pathLength: 1, opacity: 1 }}
		transition={{ pathLength: { duration: 0.8, ease: "easeInOut" }, opacity: { duration: 0.1 } }}
	/>
	<motion.path
		d="M52 82 L72 102 L110 62"
		fill="none"
		stroke="#ff0088"
		stroke-width="12"
		stroke-linecap="round"
		stroke-linejoin="round"
		initial={{ pathLength: 0, opacity: 0 }}
		animate={{ pathLength: 1, opacity: 1 }}
		transition={{ pathLength: { delay: 0.7, duration: 0.4, ease: "easeOut" }, opacity: { delay: 0.7, duration: 0.1 } }}
	/>
</svg>
