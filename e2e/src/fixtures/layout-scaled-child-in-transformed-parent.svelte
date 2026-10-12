<script lang="ts">
	/**
	 * This test is for a bug in Chrome 93, the bounding box is incorrect while the
	 * child of a transformed parent has a scale applied.
	 * https://bugs.chromium.org/p/chromium/issues/detail?id=1247858&q=getBoundingClientRect&can=1
	 * The issue is fixed in Version 94.0.4606.61 (Official Build) (x86_64).
	 */
	import { createLayoutMotion, motion } from "motion-sv";

	let hover = $state(false);

	const layout = createLayoutMotion();

	const box = {
		position: "absolute",

		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		background: "red",
	};

	const a = {
		...box,
	};

	const b = {
		...box,
		left: 50,
	};
</script>

<motion.div style={{ width: 400, height: 400, position: "relative" }}>
	<layout.div
		id="parent"
		style={{
			position: "absolute",
			width: 100,
			height: 100,
			left: "50%",
			top: "50%",
			transform: "translateY(-50%)",
		}}
	>
		<layout.div
			id="mid"
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
			}}
		>
			<layout.div
				id="box"
				data-testid="box"
				style={hover ? b : a}
				onclick={layout.update.with(() => (hover = hover ? false : true))}
				transition={{ duration: 0.2, ease: () => 0.5 }}
			/>
		</layout.div>
	</layout.div>
</motion.div>
