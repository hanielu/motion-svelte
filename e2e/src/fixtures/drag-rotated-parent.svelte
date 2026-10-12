<script lang="ts">
	import { MotionConfig, motion } from "motion-sv";

	let ref = $state<HTMLElement | null>(null);
</script>

<motion.div
	bind:ref
	style={{
		position: "absolute",
		top: 0,
		left: 0,
		width: 400,
		height: 400,
		rotate: 180,
	}}
>
	<!-- motion-sv: MotionConfig has no `transformPagePoint` and `correctParentTransform` isn't exported, so upstream's
	     transformPagePoint={correctParentTransform(ref)} can't be expressed. -->
	<MotionConfig>
		<motion.div
			data-testid="draggable"
			drag
			dragElastic={0}
			dragMomentum={false}
			style={{
				width: 100,
				height: 100,
				background: "red",
			}}
		/>
	</MotionConfig>
</motion.div>
