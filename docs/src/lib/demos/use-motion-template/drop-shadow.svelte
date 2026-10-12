<script lang="ts">
	import { motion, useMotionTemplate, useMotionValue, useTransform } from "motion-sv";

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	// The shadow falls away from the center, as if lit from above it
	const shadowX = useTransform(x, [-100, 100], [-24, 24]);
	const shadowY = useTransform(y, [-100, 100], [-24, 24]);
	const filter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 12px rgb(153 17 255 / 0.6))`;
</script>

<motion.div
	style={{ x, y, filter, width: 100, height: 100, borderRadius: 20, background: "#9911ff", cursor: "grab" }}
	drag
	dragSnapToOrigin
/>
