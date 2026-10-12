<script lang="ts">
	import { motion } from "motion-sv";
</script>

<section style="position: relative; display: flex; flex-direction: column">
	<motion.div
		id="box"
		transition={{
			duration: 0.5,
			delay: 2,
			ease: (x: number) => x,
		}}
		initial={{ transform: "scale(1)" }}
		animate={{ transform: "scale(1)" }}
		style={{
			width: "100px",
			height: "100px",
			position: "relative",
			backgroundColor: "red",
			opacity: 1,
		}}
	>
		Content
	</motion.div>
</section>
