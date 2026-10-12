<script lang="ts">
	/**
	 * Test for issue #1436: layoutDependency not working with layoutId
	 *
	 * This test verifies that when a component with layoutId unmounts and remounts
	 * in a different location (e.g., switching sections), it should NOT animate
	 * if layoutDependency hasn't changed.
	 *
	 * Expected behavior:
	 * - When clicking "Switch Section": NO animation (same layoutDependency)
	 * - When clicking "Jump here": animation should occur (layoutDependency changes)
	 */
	import { createLayoutMotion, useMotionValue } from "motion-sv";

	// Per-mount state of upstream's <Items /> component (reset whenever a section mounts).
	class Items {
		selected = $state(0);
		backgroundColor = useMotionValue("#f00");
	}

	let section = $state<"a" | "b">("a");

	const layout = createLayoutMotion();
</script>

{#snippet box(items: Items)}
	<layout.div
		id="box"
		layoutId="box"
		layoutDependency={items.selected}
		style={{
			width: 100,
			height: 100,
			backgroundColor: items.backgroundColor,
			borderRadius: 10,
		}}
		transition={{ duration: 0.5, ease: () => 0.5 }}
		onLayoutAnimationStart={() => items.backgroundColor.set("#0f0")}
		onLayoutAnimationComplete={() => items.backgroundColor.set("#00f")}
	/>
{/snippet}

{#snippet itemsView(items: Items)}
	<article style="margin-bottom: 20px">
		<button id="jump-0" onclick={layout.update.with(() => (items.selected = 0))}>Jump here</button>
		{#if items.selected === 0}
			{@render box(items)}
		{/if}
	</article>
	<article>
		<button id="jump-1" onclick={layout.update.with(() => (items.selected = 1))}>Jump here</button>
		{#if items.selected === 1}
			{@render box(items)}
		{/if}
	</article>
{/snippet}

<div style="position: relative">
	<div style="margin-bottom: 20px">
		<button id="section-a-btn" onclick={layout.update.with(() => (section = "a"))}>Section A</button>
		<button id="section-b-btn" onclick={layout.update.with(() => (section = "b"))} style="margin-left: 10px">
			Section B
		</button>
	</div>

	{#if section === "a"}
		{@const items = new Items()}
		<div id="section-a">
			<p>Section A Header</p>
			{@render itemsView(items)}
		</div>
	{/if}
	{#if section === "b"}
		{@const items = new Items()}
		<div id="section-b">
			{@render itemsView(items)}
		</div>
	{/if}
</div>
