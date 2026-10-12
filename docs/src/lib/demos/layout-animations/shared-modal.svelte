<script lang="ts">
	import { AnimatePresence, motion } from "motion-sv";

	let isOpen = $state(false);
</script>

<div class="stage">
	<motion.button
		class="open"
		layoutId="panel"
		style={{ borderRadius: 999 }}
		transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
		onclick={() => (isOpen = true)}
	>
		Open
	</motion.button>

	<AnimatePresence>
		{#if isOpen}
			<motion.div
				class="panel"
				layoutId="panel"
				style={{ borderRadius: 20 }}
				transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
				onclick={() => (isOpen = false)}
			>
				Click to close
			</motion.div>
		{/if}
	</AnimatePresence>
</div>

<style>
	.stage {
		position: relative;
		display: grid;
		place-items: center;
		width: 420px;
		height: 240px;
	}

	.stage :global(.open) {
		padding: 10px 24px;
		border: none;
		background: #ff3e00;
		color: white;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.stage :global(.panel) {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: #ff3e00;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}
</style>
