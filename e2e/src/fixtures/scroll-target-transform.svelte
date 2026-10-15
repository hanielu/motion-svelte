<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	let targetRef = $state<HTMLDivElement>();
	const { scrollYProgress } = useScroll(() => ({
		target: targetRef,
		offset: ["start end", "end start"],
	}));

	const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
	const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

	const spacer = "height: 100vh";
	const targetStyle = "height: 100vh; display: flex; align-items: center; justify-content: center";
	const box = {
		width: 100,
		height: 100,
		background: "red",
	};
</script>

<div style={spacer}></div>
<div bind:this={targetRef} style={targetStyle}>
	<motion.div id="target" style={{ ...box, opacity, y }} />
</div>
<div style={spacer}></div>
<div style={spacer}></div>
<span id="has-accelerate">{scrollYProgress.accelerate ? "true" : "false"}</span>
