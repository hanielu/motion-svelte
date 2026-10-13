<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const layout = createLayoutMotion();

	let isOn = $state(false);
	const toggleSwitch = layout.update.with(() => (isOn = !isOn));
</script>

<button class={["toggle-container", isOn ? "start" : "end"]} onclick={toggleSwitch}>
	<layout.div
		data-state={isOn}
		class="toggle-handle"
		transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }}
	/>
</button>

<style>
	.toggle-container {
		box-sizing: content-box;
		display: flex;
		width: 100px;
		height: 50px;
		padding: 10px;
		border: none;
		border-radius: 50px;
		background-color: #9911ff44;
		cursor: pointer;
	}

	.toggle-container.start {
		justify-content: flex-start;
	}

	.toggle-container.end {
		justify-content: flex-end;
	}

	.toggle-container :global(.toggle-handle) {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #9911ff;
	}
</style>
