<script lang="ts">
	import { motion } from "motion-sv";
	import Button from "./custom-component/button.svelte";

	const MotionButton = motion.create(Button);
</script>

<MotionButton initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whilePress={{ scale: 0.9 }}>
	Custom button
</MotionButton>
