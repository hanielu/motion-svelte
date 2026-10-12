<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	let distance = $state(60);

	const time = useTime();
	// Recomputes every frame as `time` changes, and whenever `distance` changes
	const y = useTransform(() => Math.sin(time.get() / 500) * distance);
</script>

<div class="stack">
	<div class="stage">
		<motion.div class="ball" style={{ y }} />
	</div>
	<label>
		Distance
		<input type="range" min="0" max="80" bind:value={distance} />
	</label>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.stage {
		display: grid;
		place-items: center;
		height: 200px;
	}

	.stage :global(.ball) {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #ff3e00;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 14px;
	}

	input {
		accent-color: #ff3e00;
	}
</style>
