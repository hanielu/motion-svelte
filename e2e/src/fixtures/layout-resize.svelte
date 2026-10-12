<script lang="ts">
	import { createLayoutMotion } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let state = $state(true);

	const layout = createLayoutMotion();

	const box = {
		position: "absolute",
		top: 0,
		left: 0,
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 100,
	};

	const b = {
		...box,
		width: 400,
		height: 200,
		top: 100,
		left: 100,
	};
</script>

<layout.div
	id="box"
	data-testid="box"
	layout={type}
	style={{ ...(state ? a : b) }}
	onclick={layout.update.with(() => (state = !state))}
	transition={{ duration: 3 }}
>
	<layout.div layout id="child" style={{ width: 100, height: 100, background: "blue" }} transition={{ duration: 3 }} />
</layout.div>
