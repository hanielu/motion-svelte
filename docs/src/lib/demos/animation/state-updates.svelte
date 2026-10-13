<script lang="ts">
	import { motion } from "motion-sv";

	let x = $state(0);
	let y = $state(0);
	let rotate = $state(0);
</script>

<div class="example">
	<div>
		<motion.div class="box" animate={{ x, y, rotate }} transition={{ type: "spring" }} />
	</div>
	<div class="inputs">
		<label>
			<code>x</code>
			<input type="range" min={-200} max={200} bind:value={x} />
			<input type="number" min={-200} max={200} bind:value={x} />
		</label>
		<label>
			<code>y</code>
			<input type="range" min={-200} max={200} bind:value={y} />
			<input type="number" min={-200} max={200} bind:value={y} />
		</label>
		<label>
			<code>rotate</code>
			<input type="range" min={-180} max={180} bind:value={rotate} />
			<input type="number" min={-180} max={180} bind:value={rotate} />
		</label>
	</div>
</div>

<style>
	.example {
		display: flex;
		align-items: center;
	}

	.example :global(.box) {
		width: 200px;
		height: 200px;
		border-radius: 20px;
		border: 5px dotted #ff0088;
		pointer-events: none;
	}

	.inputs {
		display: flex;
		flex-direction: column;
		padding-left: 50px;
	}

	label {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}

	code {
		width: 100px;
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		font-size: 12px;
	}

	input {
		accent-color: #ff0088;
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		font-size: inherit;
	}

	input[type="range"] {
		appearance: none;
		background: transparent;
	}

	input[type="number"] {
		border: 0;
		border-bottom: 1px dotted #ff0088;
		color: #ff0088;
		margin-left: 10px;
	}

	input[type="number"]:focus {
		outline: none;
		border-bottom: 2px solid #ff0088;
	}

	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type="range"]::-webkit-slider-runnable-track {
		height: 10px;
		-webkit-appearance: none;
		background: rgb(127 127 127 / 0.12);
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 10px;
		margin-top: -1px;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #ff0088;
		top: -4px;
		position: relative;
	}
</style>
