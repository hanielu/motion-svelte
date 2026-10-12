<script lang="ts">
	import { motion } from "motion-sv";

	let isOpen = $state(false);
</script>

<div class="accordion">
	<button onclick={() => (isOpen = !isOpen)} aria-expanded={isOpen}>
		{isOpen ? "Hide details" : "Show details"}
	</button>
	<motion.div
		class="content"
		initial={false}
		animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
		transition={{ duration: 0.3 }}
	>
		<p>
			Motion measures the element's natural height, animates to it, then sets <code>height</code> back to
			<code>auto</code> so the content can still reflow.
		</p>
	</motion.div>
</div>

<style>
	.accordion {
		width: 320px;
		border-radius: 12px;
		background: rgb(255 62 0 / 0.12);
	}

	button {
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}

	.accordion :global(.content) {
		overflow: hidden;
	}

	p {
		margin: 0;
		padding: 0 1rem 1rem;
		font-size: 0.875rem;
	}
</style>
