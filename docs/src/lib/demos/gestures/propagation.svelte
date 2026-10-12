<script lang="ts">
	import { motion } from "motion-sv";
</script>

<div class="propagation-demo">
	<motion.div class="card" whilePress={{ scale: 0.95 }}>
		<p>Press the card</p>
		<button onpointerdowncapture={(event) => event.stopPropagation()}>Press the button</button>
	</motion.div>
</div>

<style>
	.propagation-demo :global(.card) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem 2rem;
		border-radius: 20px;
		background: rgb(255 0 136 / 0.15);
		cursor: pointer;
		user-select: none;
	}

	p {
		margin: 0;
		font-weight: 600;
	}

	button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: #ff0088;
		color: white;
		font: inherit;
		cursor: pointer;
	}
</style>
