<script lang="ts">
	import { motion } from "motion-sv";

	const colors = ["#ff3e00", "#9911ff", "#0cdcf7", "#8df0cc", "#ff0088", "#ff3e00"];

	let container = $state<HTMLElement>();
</script>

<div class="scroller" bind:this={container}>
	<p>Scroll down</p>
	{#each colors as color, i (i)}
		<motion.div
			class="card"
			style={{ background: color }}
			initial={{ opacity: 0, x: i % 2 ? 80 : -80, rotate: i % 2 ? 8 : -8 }}
			whileInView={{ opacity: 1, x: 0, rotate: 0 }}
			inViewOptions={{ root: container, amount: 0.6 }}
			transition={{ type: "spring", bounce: 0.3 }}
		/>
	{/each}
</div>

<style>
	.scroller {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		box-sizing: border-box;
		width: 320px;
		height: 280px;
		padding: 1.5rem 0 6rem;
		overflow-y: auto;
		border-radius: 16px;
		background: rgb(153 17 255 / 0.08);
	}

	p {
		margin: 0 0 4rem;
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.scroller :global(.card) {
		flex-shrink: 0;
		width: 160px;
		height: 120px;
		border-radius: 20px;
	}
</style>
