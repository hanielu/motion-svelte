<script lang="ts">
	import { motion, useTime, useTransform } from "motion-sv";

	const time = useTime();

	// Each dot follows the same sine wave, a little behind the one before it
	const offsets = Array.from({ length: 7 }, (_, i) =>
		useTransform(() => Math.sin(time.get() / 300 - i * 0.6) * 40)
	);
</script>

<div class="row">
	{#each offsets as y, i (i)}
		<motion.div class="dot" style={{ y }} />
	{/each}
</div>

<style>
	.row {
		display: flex;
		gap: 16px;
	}

	.row :global(.dot) {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #0cdcf7;
	}
</style>
