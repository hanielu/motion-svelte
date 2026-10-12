<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let isOn = $state(false);
	const toggle = layout.update.with(() => (isOn = !isOn));
</script>

<button class={["switch", { on: isOn }]} onclick={toggle} aria-pressed={isOn}>
	<layout.div class="handle" transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }} />
</button>

<style>
	.switch {
		box-sizing: content-box;
		display: flex;
		justify-content: flex-start;
		width: 6.25rem;
		height: 3.125rem;
		padding: 0.625rem;
		border: none;
		border-radius: 999px;
		background: rgb(153 17 255 / 0.25);
		cursor: pointer;
	}

	.switch.on {
		justify-content: flex-end;
	}

	.switch :global(.handle) {
		width: 3.125rem;
		height: 3.125rem;
		border-radius: 50%;
		background: #9911ff;
	}
</style>
