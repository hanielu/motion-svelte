<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const transition = {
		default: { duration: 1, ease: () => 0.5 },
		opacity: { duration: 1, ease: () => 0.1 },
	};

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	const size = params.get("size") || false;
	const move = params.get("move") || "yes";
	let state = $state(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));

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

	const aLarge = {
		...box,
		top: 100,
		left: 200,
		width: 300,
		height: 600,
	};

	const bStyle = size ? aLarge : b;
	if (move === "no") {
		bStyle.top = bStyle.left = 0;
	}
</script>

<layout.div id="a" layoutId="box" layout={type} style={a} onclick={toggle} {transition} layoutDependency={state} />
{#if state}
	<layout.div id="b" layoutId="box" layout={type} style={bStyle} {transition} onclick={toggle} />
{/if}
