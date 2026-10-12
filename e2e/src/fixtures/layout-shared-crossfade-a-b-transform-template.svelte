<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let state = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (state = !state));

	const box = {
		position: "absolute",
		top: "50%",
		left: "50%",
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 200,
	};

	const b = {
		...box,
		top: "50%",
		left: "50%",
		width: 300,
		height: 300,
	};
</script>

<motion.div
	style={{
		position: "relative",
		width: 500,
		height: 500,
		backgroundColor: "blue",
	}}
>
	<AnimatePresence>
		{#key state}
			<layout.div
				id={state ? "a" : "b"}
				data-testid="box"
				layoutId="box"
				layout={type}
				style={{
					...(state ? a : b),
					backgroundColor: state ? "#f00" : "#0f0",
					borderRadius: state ? 0 : 20,
				}}
				transition={{ duration: 1, ease: () => 0.5 }}
				onclick={toggle}
				transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
			/>
		{/key}
	</AnimatePresence>
</motion.div>
