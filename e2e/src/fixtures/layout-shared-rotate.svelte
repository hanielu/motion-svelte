<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let state = $state(false);
	const size = $derived(state ? 100 : 200);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));
</script>

{#key state}
	<layout.div
		id="box"
		data-testid="box"
		layoutId="box"
		style={{
			rotate: 45,
			width: size,
			height: size,
			backgroundColor: "red",
		}}
		onclick={toggle}
		transition={{
			duration: 10,
			ease: state ? () => 0.5 : () => 0,
		}}
	/>
{/key}
