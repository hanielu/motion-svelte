<script lang="ts">
	import { motion, useMotionValue, useTransform, useVelocity } from "motion-sv";

	const x = useMotionValue(0);
	const xVelocity = useVelocity(x);
	// The faster the box moves, the more it stretches along the drag and squashes across it
	const scaleX = useTransform(xVelocity, [-3000, 0, 3000], [1.6, 1, 1.6]);
	const scaleY = useTransform(xVelocity, [-3000, 0, 3000], [0.6, 1, 0.6]);
</script>

<motion.div
	style={{ x, scaleX, scaleY, width: 100, height: 100, borderRadius: 20, background: "#ff0088", cursor: "grab" }}
	drag="x"
	dragSnapToOrigin
/>
