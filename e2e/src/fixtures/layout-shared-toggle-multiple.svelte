<script lang="ts">
	import { createLayoutMotion, MotionConfig } from "motion-sv";

	let isOpen = $state(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (isOpen = !isOpen));

	const box = {
		width: 100,
		height: 100,
		background: "red",
		borderRadius: 20,
	};

	const openBox = {
		width: 200,
		height: 200,
		background: "blue",
	};
</script>

<MotionConfig transition={{ duration: 1 }}>
	<button style="position: fixed; top: 0px; left: 300px" onclick={toggle}>Toggle</button>

	<layout.div layoutId="box" id="a" style={box} layoutDependency={isOpen} />
	{#if isOpen}
		<layout.div layoutId="box" id="b" style={openBox} />
	{/if}
</MotionConfig>
