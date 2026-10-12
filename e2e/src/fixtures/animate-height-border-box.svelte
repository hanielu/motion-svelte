<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Reproduction for #3147: height: auto with box-sizing: border-box
	 * ignores padding, causing animation jumps.
	 *
	 * Uses a long linear animation so the spec can sample the computed height
	 * mid-animation. With the bug, the target is 100px (padding subtracted);
	 * with the fix, the target is 140px (border-box includes padding).
	 */
</script>

<div style="padding: 20px">
	<motion.div
		id="box"
		initial={{ height: 0 }}
		animate={{ height: "auto" }}
		transition={{ type: "tween", ease: "linear", duration: 10 }}
		style={{
			boxSizing: "border-box",
			padding: 20,
			background: "blue",
			overflow: "hidden",
		}}
	>
		<div id="content" style="height: 100px; background: red"></div>
	</motion.div>
</div>
