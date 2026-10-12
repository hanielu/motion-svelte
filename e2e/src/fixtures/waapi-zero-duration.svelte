<script lang="ts">
	import { motion } from "motion-sv";

	let state = $state(false);
</script>

<section style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<motion.div
		id="box"
		transition={{ duration: 0 }}
		initial={{ transform: "scale(1)", opacity: 1 }}
		animate={{
			transform: `scale(${state ? 1 : 2})`,
			opacity: state ? 1 : 0,
		}}
		onclick={() => (state = !state)}
		style={{
			width: "100px",
			height: "100px",
			position: "relative",
			top: "100px",
			left: "100px",
			backgroundColor: "red",
			opacity: 1,
		}}
	>
		Content
	</motion.div>
</section>
