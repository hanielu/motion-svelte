<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * An example of the Motion keyframes syntax.
	 */

	const style = {
		width: 100,
		height: 100,
		backgroundColor: "#f00",
		x: 0,
		borderRadius: 20,
	};
	let isFirstFrame = true;
	// Upstream renders a MotionValue child; motion-sv children are snippets, so hold the text in state.
	let content = $state("");
</script>

<div style="--a: #00F; --b: 100px; --c: 2; --d: 0.5">
	<motion.div
		animate={{
			originX: 0,
			originY: 0,
			opacity: "var(--d)",
			backgroundColor: " var(--a)", // Should work even with space at start
			scale: "var(--c)",
			x: "var(--b)",
		}}
		transition={{ duration: 0.1 }}
		{style}
		onUpdate={({ scale }) => {
			if (isFirstFrame) {
				content = typeof scale === "string" ? "Fail" : "Success";
			}
			isFirstFrame = false;
		}}
		id="test"
	>
		{content}
	</motion.div>
</div>
