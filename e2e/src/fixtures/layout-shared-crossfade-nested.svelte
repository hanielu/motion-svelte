<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion } from "motion-sv";

	const transition = { duration: 1, ease: () => 0.5 };

	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let state = $state(true);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	// The nested motion.div registers with the layout.div's scope.
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
		top: 100,
		left: 200,
	};

	const b = {
		...box,
		top: 300,
		left: 200,
		width: 300,
		height: 300,
	};

	const childA = {
		width: 100,
		height: 100,
		background: "blue",
	};

	const childB = {
		width: 100,
		height: 100,
		background: "blue",
	};
</script>

<AnimatePresence>
	{#key state}
		<motion.div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: 500,
				height: 400,
			}}
		>
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
				{transition}
				onclick={toggle}
			>
				<motion.div id="child" layoutId="child" {transition} style={state ? childA : childB} />
			</layout.div>
		</motion.div>
	{/key}
</AnimatePresence>
