<script lang="ts">
	import { motion } from "motion-sv";

	let visualDuration = $state(0.5);
	let bounce = $state(0.25);
	let isOn = $state(false);
</script>

<div class="spring-demo">
	<button class="track" onclick={() => (isOn = !isOn)} aria-label="Animate">
		<motion.div
			class="ball"
			animate={{ x: isOn ? 180 : 0 }}
			transition={{ type: "spring", visualDuration, bounce }}
		/>
	</button>

	<label>
		<code>visualDuration</code>
		<input type="range" min={0.1} max={1.5} step={0.05} bind:value={visualDuration} />
		<output>{visualDuration}</output>
	</label>
	<label>
		<code>bounce</code>
		<input type="range" min={-1} max={1} step={0.05} bind:value={bounce} />
		<output>{bounce}</output>
	</label>
	<p>Click the track to animate.</p>
</div>

<style>
	.spring-demo {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 300px;
	}

	.track {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 999px;
		background: rgb(153 17 255 / 0.15);
		cursor: pointer;
	}

	.track :global(.ball) {
		width: 80px;
		height: 40px;
		border-radius: 999px;
		background: #9911ff;
	}

	label {
		display: grid;
		grid-template-columns: 7.5rem 1fr 2.5rem;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	input {
		accent-color: #9911ff;
	}

	output {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	p {
		margin: 0;
		font-size: 0.8125rem;
		opacity: 0.7;
	}
</style>
