<script lang="ts">
	import { motion } from "motion-sv";

	let x = $state(0);
	let y = $state(0);
	let rotate = $state(0);
</script>

<div class="state-demo">
	<motion.div class="box" animate={{ x, y, rotate }} transition={{ type: "spring" }} />

	<div class="controls">
		<label>
			<code>x</code>
			<input type="range" min={-100} max={100} bind:value={x} />
			<output>{x}</output>
		</label>
		<label>
			<code>y</code>
			<input type="range" min={-50} max={50} bind:value={y} />
			<output>{y}</output>
		</label>
		<label>
			<code>rotate</code>
			<input type="range" min={-180} max={180} bind:value={rotate} />
			<output>{rotate}</output>
		</label>
	</div>
</div>

<style>
	.state-demo {
		display: flex;
		align-items: center;
		gap: 3rem;
	}

	.state-demo :global(.box) {
		width: 100px;
		height: 100px;
		border-radius: 20px;
		background: #ff3e00;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	label {
		display: grid;
		grid-template-columns: 4rem 9rem 2.5rem;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	input {
		accent-color: #ff3e00;
	}

	output {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}
</style>
