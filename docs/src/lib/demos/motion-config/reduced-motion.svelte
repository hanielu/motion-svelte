<script lang="ts">
	import { MotionConfig, motion } from "motion-sv";

	const policies = ["never", "always"] as const;

	let isOn = $state(false);
</script>

<div class="stack">
	{#each policies as policy (policy)}
		<div class="row">
			<code>reducedMotion="{policy}"</code>
			<div class="track">
				<MotionConfig reducedMotion={policy} transition={{ duration: 0.8 }}>
					<motion.div
						class="box"
						initial={false}
						animate={{
							x: isOn ? 160 : 0,
							backgroundColor: isOn ? "#9911ff" : "#ff3e00",
						}}
					/>
				</MotionConfig>
			</div>
		</div>
	{/each}
	<button onclick={() => (isOn = !isOn)}>Toggle</button>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.row {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	code {
		font-size: 13px;
	}

	.track {
		width: 200px;
		padding: 4px;
		border-radius: 12px;
		background: rgb(153 17 255 / 0.12);
	}

	.track :global(.box) {
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
