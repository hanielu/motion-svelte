<script lang="ts">
	import { motion } from "motion-sv";

	const tabs = ["Home", "Docs", "Examples", "Blog"];
	let selected = $state(tabs[0]);
</script>

<nav>
	{#each tabs as tab (tab)}
		<button class={{ selected: tab === selected }} onclick={() => (selected = tab)}>
			{tab}
			{#if tab === selected}
				<motion.div class="underline" layoutId="underline" />
			{/if}
		</button>
	{/each}
</nav>

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
		background: #ff3e00;
	}
</style>
