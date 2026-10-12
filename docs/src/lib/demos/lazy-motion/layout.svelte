<script lang="ts">
	import { LazyMotion, createLayoutMotion, domMax, m } from "motion-sv";

	const layout = createLayoutMotion(m);

	let isOn = $state(false);
	const toggle = layout.update.with(() => (isOn = !isOn));
</script>

<LazyMotion features={domMax}>
	<button class={["switch", { on: isOn }]} onclick={toggle} aria-pressed={isOn}>
		<layout.div class="handle" transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }} />
	</button>
</LazyMotion>

<style>
	.switch {
		display: flex;
		justify-content: flex-start;
		width: 100px;
		height: 50px;
		padding: 10px;
		border: none;
		border-radius: 999px;
		background: rgb(12 220 247 / 0.25);
		cursor: pointer;
	}

	.switch.on {
		justify-content: flex-end;
	}

	.switch :global(.handle) {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #0cdcf7;
	}
</style>
