<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * An example of providing a MotionValue to an SVG component via its props
	 */
	let state = $state(false);
</script>

<svg
	width="250"
	height="250"
	viewBox="0 0 250 250"
	xmlns="http://www.w3.org/2000/svg"
	onclick={() => (state = !state)}
	style="--color: #f00"
>
	<motion.circle
		initial={false}
		cx={125}
		cy={125}
		r="100"
		animate={{ fill: state ? "var(--color)" : "#00f" }}
		transition={{ duration: 3, ease: () => 0.5 }}
	/>
</svg>
