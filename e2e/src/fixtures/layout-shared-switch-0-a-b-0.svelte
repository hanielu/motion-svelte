<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const transition = {
		default: { duration: 5, ease: () => 0.5 },
	};

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let count = $state(0);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const increment = layout.update.with(() => (count = count + 1));

	const box = {
		position: "absolute",
		top: 0,
		left: 0,
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 200,
	};

	const b = {
		...box,
		top: 100,
		left: 200,
		width: 300,
		height: 300,
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div id="trigger" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px" onclick={increment}>
	{#if count === 1 || count === 3}
		<layout.div id="a" layoutId="box" layout={type} style={a} {transition} />
	{/if}
	{#if count === 2}
		<layout.div id="b" layoutId="box" style={b} {transition} />
	{/if}
</div>
