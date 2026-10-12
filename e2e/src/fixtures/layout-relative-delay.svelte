<script lang="ts">
	import { createLayoutMotion, domMax, LazyMotion, m } from "motion-sv";

	let state = $state(true);
	let frameCount = 0;

	const layout = createLayoutMotion(m);
</script>

<LazyMotion features={domMax}>
	<layout.div
		id="parent"
		onclick={layout.update.with(() => (state = !state))}
		style={{
			position: "absolute",
			top: state ? 0 : 200,
			left: state ? 0 : 200,
			width: state ? 200 : 400,
			height: 200,
			background: "red",
		}}
		transition={{
			ease: (t: number) => {
				frameCount++;
				// This is a bit funny but boxes are resolved relatively after
				// the first frame
				return frameCount > 1 ? 0.5 : t;
			},
		}}
	>
		<layout.div
			id="child"
			style={{
				width: state ? 100 : 200,
				height: 100,
				background: "blue",
			}}
			transition={{
				delay: 100,
			}}
		/>
	</layout.div>
</LazyMotion>
