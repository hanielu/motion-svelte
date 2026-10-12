<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	let isOpen = $state(false);
	let error = $state("");

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const setIsOpen = layout.update.with((value: boolean) => (isOpen = value));
</script>

<div style="position: relative">
	<AnimatePresence mode="wait">
		{#if isOpen}
			<layout.div
				layoutId={"1"}
				id="open"
				style={{
					height: "400px",
					width: "400px",
					backgroundColor: "red",
					position: "absolute",
					top: "200px",
					left: "200px",
				}}
				transition={{ duration: 0.1 }}
				onLayoutMeasure={(layout) => {
					if (layout.x.min !== 200) {
						error = "Layout measured incorrectly";
					}
				}}
				onclick={() => setIsOpen(false)}
			></layout.div>
		{/if}
	</AnimatePresence>
	<layout.div
		id="target"
		layoutId="1"
		style={{
			height: "200px",
			width: "200px",
			backgroundColor: "blue",
		}}
		transition={{ duration: 0.1 }}
		onclick={() => {
			setIsOpen(true);
		}}
		layoutDependency={isOpen}
	/>
	<div id="error" style="color: red">
		{error}
	</div>
</div>
