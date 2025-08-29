<script lang="ts">
	import { motion } from "motion-sve";

	let count = $state(0);
</script>

<motion.div
	id="test"
	style={{ width: 100, height: 100, backgroundColor: "red", marginTop: 50 }}
	initial={{ rotate: 0 }}
	animate={{ rotate: 60 + count, x: count }}
	whileHover={{ scale: 1.1 }}
	whilePress={{ scale: 0.95 }}
	onHoverStart={() => console.log("hover started!")}
/>

<button onclick={() => (count += 50)}>Click me</button>
