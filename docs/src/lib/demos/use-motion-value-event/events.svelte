<script lang="ts">
	import { animate, motion, useMotionValue, useMotionValueEvent } from "motion-sv";

	const x = useMotionValue(0);

	let latest = $state(0);
	let log = $state<{ id: number; name: string }[]>([]);
	let nextId = 0;

	const record = (name: string) => (log = [{ id: nextId++, name }, ...log].slice(0, 4));

	useMotionValueEvent(x, "change", (value) => (latest = Math.round(value)));
	useMotionValueEvent(x, "animationStart", () => record("animationStart"));
	useMotionValueEvent(x, "animationComplete", () => record("animationComplete"));
	useMotionValueEvent(x, "animationCancel", () => record("animationCancel"));

	const toggle = () => animate(x, x.get() < 100 ? 200 : 0, { duration: 1 });
</script>

<div class="stack">
	<div class="track">
		<motion.div class="box" style={{ x }} />
	</div>
	<button onclick={toggle}>Animate</button>
	<output>change: {latest}</output>
	<ol>
		{#each log as entry (entry.id)}
			<li>{entry.name}</li>
		{/each}
	</ol>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
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

	button {
		padding: 8px 20px;
		border: none;
		border-radius: 8px;
		background: #ff3e00;
		color: white;
		font: inherit;
		cursor: pointer;
	}

	output,
	ol {
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		font-size: 14px;
	}

	ol {
		width: 100%;
		height: 6em;
		margin: 0;
		padding: 0;
		list-style: none;
		text-align: center;
	}

	li:not(:first-child) {
		opacity: 0.5;
	}
</style>
