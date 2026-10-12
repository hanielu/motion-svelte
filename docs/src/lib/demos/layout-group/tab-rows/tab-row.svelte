<script lang="ts">
	import { LayoutGroup, motion } from "motion-sv";

	let { id, tabs }: { id: string; tabs: string[] } = $props();

	let selected = $state(0);
</script>

<LayoutGroup {id}>
	<nav>
		{#each tabs as tab, index (tab)}
			<button class={{ selected: index === selected }} onclick={() => (selected = index)}>
				{tab}
				{#if index === selected}
					<motion.div class="underline" layoutId="underline" />
				{/if}
			</button>
		{/each}
	</nav>
</LayoutGroup>

<style>
	nav {
		display: flex;
		gap: 0.25rem;
	}

	button {
		position: relative;
		padding: 0.5rem 1rem;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		opacity: 0.6;
		cursor: pointer;
	}

	button.selected {
		opacity: 1;
	}

	nav :global(.underline) {
		position: absolute;
		right: 0.5rem;
		bottom: -2px;
		left: 0.5rem;
		height: 3px;
		border-radius: 3px;
		background: #0cdcf7;
	}
</style>
