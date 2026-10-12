<script lang="ts">
	import { createLayoutMotion, MotionConfig } from "motion-sv";

	let isOpen = $state(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const setIsOpen = layout.update.with((value: boolean) => (isOpen = value));

	const box = {
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 200,
	};

	const b = {
		...box,
		width: 300,
		height: 300,
		background: "blue",
		borderRadius: 20,
	};
</script>

<MotionConfig transition={{ duration: 0.1 }}>
	<layout.div id="a" layoutId="box" style={a} onclick={() => setIsOpen(true)} layoutDependency={isOpen} />
	{#if isOpen}
		<layout.div id="b" layoutId="box" style={b} onclick={() => setIsOpen(false)} />
	{/if}
</MotionConfig>
