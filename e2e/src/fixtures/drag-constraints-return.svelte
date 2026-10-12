<script lang="ts">
	import { motion } from "motion-sv";

	let constraintsRef = $state<HTMLElement | null>(null);
	const params = new URLSearchParams(window.location.search);
	const layout = params.get("layout") || undefined;
</script>

<motion.div
	id="constraints"
	bind:ref={constraintsRef}
	style={{
		width: 300,
		height: 300,
		background: "rgba(0, 0, 255, 0.2)",
	}}
>
	<motion.div
		id="box"
		data-testid="draggable"
		drag
		dragConstraints={constraintsRef ?? undefined}
		dragElastic={1}
		dragMomentum={false}
		layout={layout as any}
		style={{
			width: 100,
			height: 100,
			background: "red",
		}}
	/>
</motion.div>
