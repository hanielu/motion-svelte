<script lang="ts">
	import { motion, useCurrentMotionValue, useMotionValueEvent, useScroll } from "motion-sv";

	let containerRef = $state<HTMLDivElement>();
	let targetRef = $state<HTMLDivElement>();
	const { scrollYProgress } = useScroll(() => ({
		container: containerRef,
		target: targetRef,
		offset: ["start start", "end start"],
	}));

	useMotionValueEvent(scrollYProgress, "change", console.log);

	// motion-sv: a MotionValue can't be passed as children; render its latest value instead.
	const label = useCurrentMotionValue(scrollYProgress);
</script>

<div style="height: 100px; width: 100px"></div>
<div id="container" bind:this={containerRef} style="overflow-y: auto; height: 300px; width: 300px; position: relative">
	<div style="height: 1000px; width: 300px; background: red">
		<div bind:this={targetRef} style="width: 100px; height: 100px; font-size: 24px; display: flex; background: white">
			<motion.span id="label">{label.current}</motion.span>
		</div>
	</div>
</div>
