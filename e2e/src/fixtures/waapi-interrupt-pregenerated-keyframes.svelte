<script lang="ts">
	import { motion } from "motion-sv";
	import { onMount } from "svelte";

	let state = $state(false);

	onMount(() => {
		const timer = setTimeout(() => {
			state = !state;
		}, 50);

		return () => {
			clearTimeout(timer);
		};
	});
</script>

<section style="position: relative; display: flex; flex-direction: column">
	<motion.div
		id="box"
		transition={{ type: "spring" }}
		initial={{ clipPath: "inset(0px)" }}
		animate={{ clipPath: state ? "inset(0px)" : "inset(20px)" }}
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
