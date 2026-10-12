<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div class="focus-demo">
	<motion.input
		placeholder="Click or tab here"
		whileFocus={{ scale: 1.05, boxShadow: "0 0 0 3px rgb(255 62 0 / 0.5)" }}
		transition={{ type: "spring", visualDuration: 0.2, bounce: 0.4 }}
	/>
</div>

<style>
	.focus-demo :global(input) {
		width: 240px;
		padding: 12px 16px;
		border: 1px solid rgb(255 62 0 / 0.4);
		border-radius: 12px;
		outline: none;
		background: rgb(255 62 0 / 0.08);
		color: inherit;
		font: inherit;
	}
</style>
