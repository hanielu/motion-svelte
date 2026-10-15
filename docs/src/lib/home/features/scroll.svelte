<script lang="ts">
	import { motion, useScroll } from "motion-sv";

	let list = $state<HTMLElement>();
	const { scrollYProgress } = useScroll(() => ({ container: list }));
</script>

<div class="frame">
	<div class="list" bind:this={list}>
		{#each { length: 12 }, i}
			<div class="line" style:width="{55 + ((i * 37) % 40)}%"></div>
		{/each}
	</div>
	<svg class="ring" viewBox="0 0 40 40" aria-hidden="true">
		<circle cx="20" cy="20" r="16" class="track" />
		<motion.circle cx="20" cy="20" r="16" class="progress" style={{ pathLength: scrollYProgress }} />
	</svg>
</div>

<style>
	.frame {
		position: relative;
		width: 13rem;
		height: 9rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--bg-subtle);
		overflow: hidden;
	}

	.list {
		height: 100%;
		padding: 0.875rem 3.5rem 0.875rem 0.875rem;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.line {
		height: 0.5rem;
		margin-bottom: 0.75rem;
		border-radius: 999px;
		background: var(--border);
	}

	.ring {
		position: absolute;
		top: 0.625rem;
		right: 0.625rem;
		width: 2.25rem;
		height: 2.25rem;
		transform: rotate(-90deg);
	}

	/* Global: the progress circle is rendered by a motion component, outside this component's scoped styles */
	.ring :global(circle) {
		fill: none;
		stroke-width: 4;
	}

	.track {
		stroke: var(--border);
	}

	.ring :global(.progress) {
		stroke: #0cdcf7;
		stroke-linecap: round;
	}
</style>
