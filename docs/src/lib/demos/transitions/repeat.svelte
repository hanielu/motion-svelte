<script lang="ts">
	import { motion } from "motion-sv";

	const repeatTypes = ["loop", "reverse", "mirror"] as const;
</script>

<div class="repeat-demo">
	{#each repeatTypes as repeatType (repeatType)}
		<div class="row">
			<code>{repeatType}</code>
			<div class="track">
				<motion.div
					class="dot"
					animate={{ x: 200 }}
					transition={{ duration: 1, ease: "easeIn", repeat: Infinity, repeatType, repeatDelay: 0.3 }}
				/>
			</div>
		</div>
	{/each}
</div>

<style>
	.repeat-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		display: grid;
		grid-template-columns: 4.5rem 240px;
		align-items: center;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.track {
		padding: 4px;
		border-radius: 999px;
		background: rgb(255 0 136 / 0.12);
	}

	.track :global(.dot) {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #ff0088;
	}
</style>
