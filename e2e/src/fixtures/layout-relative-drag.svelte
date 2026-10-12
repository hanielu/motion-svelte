<script lang="ts">
	import { createLayoutMotion } from "motion-sv";
	import { untrack } from "svelte";

	let state = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));

	$effect(() => untrack(toggle));
</script>

<layout.div
	id="parent"
	drag
	dragElastic={0}
	dragMomentum={false}
	layout
	layoutDependency={state}
	style={{
		width: 200,
		height: 200,
		background: "red",
	}}
>
	<layout.div id="child" layout layoutDependency={state} style={{ width: 100, height: 100, background: "blue" }} />
</layout.div>
