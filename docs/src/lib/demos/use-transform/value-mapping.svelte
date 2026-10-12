<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-sv";

	const x = useMotionValue(0);
	const background = useTransform(x, [-150, 0, 150], ["#ff0088", "#9911ff", "#0cdcf7"]);
	const rotate = useTransform(x, [-150, 150], [-90, 90]);
</script>

<motion.div
	style={{ x, rotate, background, width: 100, height: 100, borderRadius: 20, cursor: "grab" }}
	drag="x"
	dragConstraints={{ left: -150, right: 150 }}
/>
