<script lang="ts">
	import { animate, AnimatePresence, createLayoutMotion } from "motion-sv";

	const containerStyles = "position: relative; display: flex; flex-direction: column; padding: 100px;";

	const boxStyles = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	type Position = "static" | "relative" | "absolute" | "fixed";
	type Anchor = "left" | "right";

	let state = $state(true);
	const params = new URLSearchParams(window.location.search);
	const position = (params.get("position") || "static") as Position;
	const anchorX = (params.get("anchor-x") || "left") as Anchor;
	const itemStyle = position === "relative" ? { position, top: 100, left: 100 } : {};
	const itemCss = position === "relative" ? `position: ${position}; top: 100px; left: 100px;` : "";

	let ref = $state<HTMLDivElement>();

	$effect(() => {
		if (!ref) return;

		animate(ref, { opacity: [0, 1] }, { duration: 1 });
		animate(ref, { opacity: [1, 0.5] }, { duration: 1 });
	});

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
</script>

<div style={containerStyles} onclick={layout.update.with(() => (state = !state))} role="presentation">
	<AnimatePresence {anchorX} mode="popLayout">
		<layout.div id="a" transition={{ ease: () => 1 }} style={{ ...boxStyles, ...itemStyle }} />
		{#if state}
			<layout.div
				id="b"
				animate={{
					opacity: 1,
					transition: { duration: 0.001 },
				}}
				exit={{ opacity: 0, transition: { duration: 10 } }}
				style={{
					...boxStyles,
					...itemStyle,
					backgroundColor: "green",
				}}
			/>
		{/if}
		<layout.div
			id="c"
			transition={{ ease: () => 1 }}
			style={{
				...boxStyles,
				...itemStyle,
				backgroundColor: "blue",
			}}
		/>
	</AnimatePresence>
	<div bind:this={ref} style="width: 100px; height: 100px; background-color: purple; {itemCss}"></div>
</div>
