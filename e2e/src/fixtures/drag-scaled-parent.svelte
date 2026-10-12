<script lang="ts">
	import { MotionConfig, motion } from "motion-sv";

	/**
	 * Reproduction for #3132: drag inside a parent with transform: scale()
	 * Uses correctParentTransform to compensate for the parent's scale.
	 */
	const params = new URLSearchParams(window.location.search);
	const scale = parseFloat(params.get("scale") || "0.5");
	let ref = $state<HTMLDivElement>();
</script>

<div
	bind:this={ref}
	id="container"
	style="width: 800px; height: 800px; background: blue; transform: scale({scale}); transform-origin: top left"
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
</div>
