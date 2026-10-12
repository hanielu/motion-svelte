<script lang="ts">
	import { MotionConfig, motion } from "motion-sv";

	let isOn = $state(false);
	const x = $derived(isOn ? 120 : -120);
</script>

<div class="stack">
	<MotionConfig transition={{ type: "spring", visualDuration: 0.6, bounce: 0.4 }}>
		<motion.div class="box" style={{ background: "#ff3e00" }} animate={{ x }} />
		<motion.div class="box" style={{ background: "#9911ff" }} animate={{ x, rotate: isOn ? 180 : 0 }} />
		<!-- Its own transition takes precedence -->
		<motion.div
			class="box"
			style={{ background: "#0cdcf7" }}
			animate={{ x }}
			transition={{ duration: 0.6, ease: "linear" }}
		/>
	</MotionConfig>
	<button onclick={() => (isOn = !isOn)}>Toggle</button>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.stack :global(.box) {
		width: 40px;
		height: 40px;
		border-radius: 10px;
	}

	button {
		margin-top: 12px;
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
