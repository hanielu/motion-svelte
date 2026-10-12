<script lang="ts">
	import { createLayoutMotion, LayoutGroup, motion } from "motion-sv";

	const style = {
		width: 100,
		height: 100,
		background: "red",
		opacity: 1,
		borderRadius: 20,
		margin: 20,
	};

	const stackStyle = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "start",
	};

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();

	// Item's state (rendered once)
	let variant = $state("a");
	const isVisible = () => variant === "a";
	const toggleVariant = layout.update.with(() => (variant = variant === "a" ? "b" : "a"));
</script>

{#snippet Item()}
	<LayoutGroup id="group-2">
		<motion.div style={{ display: "contents" }}>
			{#if isVisible()}
				<layout.div id="a" layoutId="a" {style} onclick={toggleVariant} />
			{/if}
		</motion.div>
	</LayoutGroup>
{/snippet}

<LayoutGroup id="group-1">
	<motion.div style={{ display: "contents" }}>
		<motion.div style={stackStyle}>
			{@render Item()}
		</motion.div>
		<layout.div
			layoutId="b"
			style={{ ...style, backgroundColor: "blue" }}
			id="b"
			transition={{ duration: 0.2, ease: () => 0.5 }}
		/>
	</motion.div>
</LayoutGroup>
