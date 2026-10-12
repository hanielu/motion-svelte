<script lang="ts">
	import { AnimatePresence, motion, stagger, type Variants } from "motion-sv";

	const items = ["Inbox", "Drafts", "Sent", "Archive"];

	let isOpen = $state(true);

	const list: Variants = {
		visible: { opacity: 1, transition: { when: "beforeChildren", delayChildren: stagger(0.06) } },
		hidden: { opacity: 0, transition: { when: "afterChildren", delayChildren: stagger(0.04, { from: "last" }) } },
	};

	const item: Variants = {
		visible: { opacity: 1, x: 0 },
		hidden: { opacity: 0, x: -24 },
	};
</script>

<div class="stage">
	<button onclick={() => (isOpen = !isOpen)}>{isOpen ? "Close menu" : "Open menu"}</button>
	<div class="slot">
		<AnimatePresence>
			{#if isOpen}
				<motion.ul class="menu" variants={list} initial="hidden" animate="visible" exit="hidden">
					{#each items as label (label)}
						<motion.li variants={item}>{label}</motion.li>
					{/each}
				</motion.ul>
			{/if}
		</AnimatePresence>
	</div>
</div>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.slot {
		width: 200px;
		height: 200px;
	}

	.stage :global(.menu) {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 8px;
		border-radius: 14px;
		background: rgb(12 220 247 / 0.15);
		list-style: none;
	}

	.stage :global(li) {
		margin: 0;
		padding: 8px 12px;
		border-radius: 8px;
		background: rgb(12 220 247 / 0.3);
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #0cdcf7;
		color: #0f172a;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
</style>
