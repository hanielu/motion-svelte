<script lang="ts">
	import { createLayoutMotion, MotionConfig } from "motion-sv";

	const transition = {
		// ease: () => 0.5,
		duration: 10,
	};

	let isOpen = $state(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (isOpen = !isOpen));

	const box = {
		background: "red",
		gridArea: "1 / 1",
	};

	const container =
		"display: flex; justify-content: center; align-items: center; gap: 20px; width: 300px; height: 300px";

	const a = {
		...box,
		width: 80,
		height: 80,
	};

	const b = {
		...box,
		left: 200,
		width: 140,
		height: 140,
	};
</script>

{#snippet BoxA(isOpen: boolean)}
	<div style={container}>
		<layout.div style={{ ...a, borderRadius: 24 }} {transition} layoutId="boxA" layoutDependency={isOpen} />
		{#if isOpen}
			<layout.div class="measure-box" style={{ ...b, borderRadius: 0 }} {transition} layoutId="boxA" />
		{/if}
	</div>
{/snippet}

{#snippet BoxB(isOpen: boolean)}
	<div style={container}>
		{#if !isOpen}
			<layout.div style={{ ...a, borderRadius: 24 }} {transition} layoutId="boxB" />
		{:else}
			<layout.div class="measure-box" style={{ ...b, borderRadius: 0 }} {transition} layoutId="boxB" />
		{/if}
	</div>
{/snippet}

<MotionConfig transition={{ duration: 1 }}>
	<button id="next" onclick={toggle}>Next</button>
	{@render BoxA(isOpen)}
	{@render BoxB(isOpen)}
</MotionConfig>
