<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	const time = useTime();
	const rotate = useTransform(
		time,
		[0, 4000], // For every 4 seconds...
		[0, 360], // ...rotate 360deg
		{ clamp: false }
	);
</script>

<motion.div style={{ rotate, width: 100, height: 100, borderRadius: 20, background: "#8df0cc" }} />
