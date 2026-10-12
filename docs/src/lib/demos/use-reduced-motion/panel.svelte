<script lang="ts">
	import { motion, useReducedMotion } from "motion-sv";

	const reducedMotion = useReducedMotion();

	let isOpen = $state(false);

	// With reduced motion, fade the panel in place instead of sliding it
	const closedX = $derived(reducedMotion.current ? 0 : "-100%");
</script>

<div class="frame">
	<motion.div
		class="panel"
		initial={false}
		animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : closedX }}
		transition={{ duration: 0.4, ease: "easeOut" }}
	>
		Panel
	</motion.div>
	<div class="content">
		<button onclick={() => (isOpen = !isOpen)}>{isOpen ? "Close" : "Open"}</button>
		<p>Reduced motion: {reducedMotion.current ? "on" : "off"}</p>
	</div>
</div>

<style>
	.frame {
		position: relative;
		display: flex;
		width: min(420px, 100%);
		height: 200px;
		border-radius: 16px;
		background: rgb(141 240 204 / 0.12);
		overflow: hidden;
	}

	.frame :global(.panel) {
		position: absolute;
		inset: 0 auto 0 0;
		width: 160px;
		padding: 16px;
		background: #8df0cc;
		color: #0f1115;
		font-weight: 600;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		margin-left: auto;
		padding: 16px;
	}

	button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background: #8df0cc;
		color: #0f1115;
		font: inherit;
		cursor: pointer;
	}

	p {
		margin: 0;
		font-size: 14px;
	}
</style>
