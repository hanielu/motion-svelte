<script lang="ts">
	import { motion, stagger, type Variants } from "motion-sv";

	const list: Variants = {
		visible: {
			opacity: 1,
			transition: { when: "beforeChildren", delayChildren: stagger(0.08) },
		},
		hidden: {
			opacity: 0,
			transition: { when: "afterChildren", delayChildren: stagger(0.05, { from: "last" }) },
		},
	};

	const item: Variants = {
		visible: { opacity: 1, x: 0 },
		hidden: { opacity: 0, x: -40 },
	};

	const items = ["Animate", "Variants", "Orchestrate", "Stagger"];

	let isVisible = $state(true);
</script>

<div class="variants-demo">
	<button onclick={() => (isVisible = !isVisible)}>{isVisible ? "Hide" : "Show"}</button>
	<motion.ul initial="hidden" animate={isVisible ? "visible" : "hidden"} variants={list}>
		{#each items as label (label)}
			<motion.li variants={item}>{label}</motion.li>
		{/each}
	</motion.ul>
</div>

<style>
	.variants-demo {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	button {
		width: 5rem;
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}

	.variants-demo :global(ul) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 200px;
		margin: 0;
		padding: 12px;
		border-radius: 16px;
		background: rgb(255 62 0 / 0.12);
		list-style: none;
	}

	.variants-demo :global(li) {
		padding: 10px 14px;
		border-radius: 10px;
		background: #ff3e00;
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
