<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	let state = $state(true);

	const layout = createLayoutMotion();
	const setState = layout.update.with((value: boolean) => (state = value));

	// useLayoutEffect: runs after the DOM update, before paint.
	$effect(() => {
		if (state === false) setState(true);
	});

	const box = {
		position: "absolute",
		top: 0,
		left: 200,
		width: 100,
		height: 100,
		background: "red",
	};

	const a = box;

	const b = {
		...box,
		left: 500,
	};
</script>

<layout.div
	id="box"
	data-testid="box"
	style={state ? a : b}
	onclick={() => setState(!state)}
	transition={{ duration: 10 }}
/>
