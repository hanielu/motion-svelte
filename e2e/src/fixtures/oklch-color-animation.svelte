<script lang="ts">
	import { motion } from "motion-sv";

	function supportsOklch() {
		const el = document.createElement("div");
		el.style.backgroundColor = "oklch(0.5 0.1 200)";
		return el.style.backgroundColor !== "";
	}

	let isActive = $state(false);
	let result = $state("");
</script>

<div style="padding: 20px">
	<button id="toggle" onclick={() => (isActive = !isActive)}>Toggle color</button>
	<motion.div
		id="box"
		animate={{
			backgroundColor: isActive ? "oklch(0.65 0.18 260)" : "#ffffff",
		}}
		transition={{
			type: "tween",
			ease: "linear",
			duration: 0.5,
		}}
		onAnimationComplete={() => {
			const el = document.getElementById("box");
			if (el) {
				result = JSON.stringify({
					computed: getComputedStyle(el).backgroundColor,
					supportsOklch: supportsOklch(),
				});
			}
		}}
		style={{
			width: 100,
			height: 100,
			backgroundColor: "#ffffff",
		}}
	/>
	<div id="result">{result}</div>
</div>
