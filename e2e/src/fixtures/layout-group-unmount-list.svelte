<script lang="ts">
	import { createLayoutMotion, LayoutGroup, motion } from "motion-sv";
	import type { Snippet } from "svelte";

	const style = {
		width: 100,
		height: 100,
		opacity: 1,
		borderRadius: 20,
		margin: 20,
	};

	const containerStyle = {
		display: "block",
		width: "min-content",
		height: "min-content",
	};

	const stackStyle = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
		padding: 20,
		width: "auto",
		height: "auto",

		backgroundColor: "blue",
	};

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	// The nested motion components register with the layout.div's scope.
	const layout = createLayoutMotion();

	// Each Item's own `visible` state
	let visible = $state<Record<string, boolean>>({ a: true, b: true });
</script>

{#snippet Item(id: string, backgroundColor: string)}
	{@const isVisible = () => !!visible[id]}
	<LayoutGroup id="group-2">
		<motion.div style={{ display: "contents" }}>
			{#if isVisible()}
				<motion.div
					{id}
					layoutId={id}
					style={{ ...style, backgroundColor }}
					onclick={layout.update.with(() => (visible[id] = false))}
					transition={{ duration: 10, ease: () => 0.5 }}
				/>
			{/if}
		</motion.div>
	</LayoutGroup>
{/snippet}

{#snippet List(children: Snippet)}
	<LayoutGroup id="list">
		<motion.div style={{ display: "contents" }}>
			<layout.div
				id="stack"
				layoutId="stack"
				style={{ containerStyle }}
				transition={{ duration: 0.2, ease: () => 0.5 }}
			>
				<motion.div style={stackStyle}>
					<motion.div style={{ display: "contents" }}>
						{@render children()}
					</motion.div>
				</motion.div>
			</layout.div>
		</motion.div>
	</LayoutGroup>
{/snippet}

{#snippet items()}
	{@render Item("a", "red")}
	{@render Item("b", "yellow")}
{/snippet}

<LayoutGroup id="group-1">
	<motion.div style={{ position: "absolute", left: 100, bottom: 100 }}>
		{@render List(items)}
	</motion.div>
</LayoutGroup>
