<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-sv";

	const x = useMotionValue(0);
	const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
</script>

<motion.div
	style={{ x, opacity, width: 100, height: 100, borderRadius: 20, background: "#ff3e00", cursor: "grab" }}
	drag="x"
	dragSnapToOrigin
/>
