<script lang="ts">
	import { motion } from "motion-sv";

	const draw = { pathLength: 1, opacity: 1 };
	const hidden = { pathLength: 0, opacity: 0 };
</script>

<motion.svg width="160" height="160" viewBox="0 0 100 100" fill="none" stroke-width="6" stroke-linecap="round">
	<motion.circle
		cx="50"
		cy="50"
		r="40"
		stroke="#0cdcf7"
		initial={hidden}
		animate={draw}
		transition={{ duration: 0.8, ease: "easeInOut", opacity: { duration: 0.01 } }}
	/>
	<motion.path
		d="M31 51 L44 64 L69 37"
		stroke="#8df0cc"
		stroke-linejoin="round"
		initial={hidden}
		animate={draw}
		transition={{ duration: 0.4, delay: 0.7, ease: "easeOut", opacity: { delay: 0.7, duration: 0.01 } }}
	/>
</motion.svg>
