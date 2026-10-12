<script lang="ts">
	import { motion } from "motion-sv";

	const container =
		"width: 50%; height: 300px; background: blue; border-radius: 20px; display: flex; justify-content: center; align-items: center; margin: 0 auto";

	const child = {
		width: 200,
		height: 200,
		background: "red",
		borderRadius: 20,
	};

	let ref = $state<HTMLDivElement>();
	let count = $state(0);
</script>

<div bind:this={ref} style={container} id="constraints">
	<motion.div drag dragConstraints={ref} style={child} onclick={() => (count = count + 1)} id="box" />
</div>
