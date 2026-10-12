<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div style="height: 2000px; padding-top: 100px">
	<motion.div
		id="box"
		data-testid="draggable"
		drag
		dragMomentum={true}
		initial={{
			width: 50,
			height: 1000,
			background: "red",
			x: 0,
			y: 0,
		}}
	/>
</div>
