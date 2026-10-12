<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const box = {
		position: "absolute",
		left: 0,
		background: "red",
	};

	const a = {
		...box,
		top: 100,
		width: 100,
		height: 100,
	};

	const b = {
		...box,
		top: 300,
		width: 100,
		height: 100,
	};

	let state = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const setState = layout.update.with((value: boolean) => (state = value));
</script>

<!-- React Fragments inside components: snippets render without a wrapper element. -->
{#snippet A(onClick: () => void)}
	<layout.div
		id="box"
		data-testid="box"
		layoutId="box"
		style={a}
		onclick={onClick}
		transition={{ duration: 1, ease: () => 0.5 }}
	/>
{/snippet}

{#snippet B(onClick: () => void)}
	<layout.div
		id="box"
		data-testid="box"
		layoutId="box"
		style={b}
		onclick={onClick}
		transition={{ duration: 1, ease: () => 0.5 }}
	/>
{/snippet}

{#if state}
	{@render A(() => setState(false))}
{:else}
	{@render B(() => setState(true))}
{/if}
