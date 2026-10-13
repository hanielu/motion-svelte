<script lang="ts">
	import { motion, useSpring } from "motion-sv";

	const x = useSpring(0, { visualDuration: 0.5, bounce: 0.3 });

	const target = () => (x.get() < 100 ? 200 : 0);
</script>

<div class="stack">
	<div class="track">
		<motion.div class="box" style={{ x }} />
	</div>
	<div class="buttons">
		<button onclick={() => x.set(target())}>set()</button>
		<button onclick={() => x.jump(target())}>jump()</button>
	</div>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 260px;
	}

	.track {
		width: 100%;
		padding: 6px;
		border-radius: 14px;
		background: rgb(255 62 0 / 0.15);
	}

	.track :global(.box) {
		width: 48px;
		height: 48px;
		border-radius: 10px;
		background: #ff3e00;
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		cursor: pointer;
	}
</style>
