<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	const containerStyles = "position: relative; display: flex; flex-direction: column; padding: 100px;";

	const boxStyles = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	let show = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

<div id="container" style={containerStyles}>
	<button id="toggle" onclick={layout.update.with(() => (show = !show))}>Toggle</button>
	<AnimatePresence mode="popLayout">
		<layout.div id="a" style={boxStyles} />
		{#if show}
			<layout.div
				id="target"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{
					opacity: 0,
					transition: { duration: 10 },
				}}
				style={{
					...boxStyles,
					backgroundColor: "green",
				}}
			/>
		{/if}
		<layout.div
			id="c"
			style={{
				...boxStyles,
				backgroundColor: "blue",
			}}
		/>
	</AnimatePresence>
</div>
