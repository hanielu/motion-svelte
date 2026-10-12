<script lang="ts">
	import { motion } from "motion-sv";

	const step = 60;
</script>

<div class="inertia-demo">
	<div class="track">
		{#each [0, 1, 2, 3, 4, 5] as i (i)}
			<span class="tick" style:left="{i * step + 25}px"></span>
		{/each}
		<motion.div
			class="handle"
			drag="x"
			dragConstraints={{ left: 0, right: step * 5 }}
			dragTransition={{
				power: 0.2,
				timeConstant: 200,
				modifyTarget: (target) => Math.round(target / step) * step,
			}}
			whileDrag={{ scale: 1.1 }}
		/>
	</div>
	<p>Drag and release: the handle always comes to rest on a tick.</p>
</div>

<style>
	.inertia-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.track {
		position: relative;
		width: 350px;
		padding: 5px 0;
		border-radius: 12px;
		background: rgb(12 220 247 / 0.12);
	}

	.tick {
		position: absolute;
		top: 50%;
		width: 2px;
		height: 12px;
		border-radius: 1px;
		background: rgb(12 220 247 / 0.5);
		translate: -1px -50%;
	}

	.track :global(.handle) {
		position: relative;
		width: 50px;
		height: 50px;
		border-radius: 10px;
		background: #0cdcf7;
		cursor: grab;
	}

	p {
		margin: 0;
		font-size: 0.8125rem;
		opacity: 0.7;
	}
</style>
