<script lang="ts">
	import { motion } from "motion-sv";

	let status = $state("Press me");
	let count = $state(0);
</script>

<div class="press-demo">
	<motion.div
		class="pad"
		whilePress={{ scale: 0.9, rotate: 3 }}
		onPressStart={() => (status = "Pressing…")}
		onPress={() => {
			count++;
			status = "Pressed!";
		}}
		onPressCancel={() => (status = "Cancelled")}
	>
		{status}
	</motion.div>
	<p>Presses: {count}. Release outside the pad to cancel.</p>
</div>

<style>
	.press-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.press-demo :global(.pad) {
		display: grid;
		place-items: center;
		width: 160px;
		height: 100px;
		border-radius: 20px;
		background: #9911ff;
		color: white;
		font-weight: 600;
		cursor: pointer;
		user-select: none;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		opacity: 0.7;
	}
</style>
