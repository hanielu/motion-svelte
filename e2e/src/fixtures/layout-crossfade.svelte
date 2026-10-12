<script lang="ts">
	import { AnimatePresence, createLayoutMotion, MotionConfig } from "motion-sv";

	let state = $state(false);

	const layout = createLayoutMotion();
</script>

<MotionConfig transition={{ duration: 10, ease: (p: number) => 0.25 }}>
	<div style="display: flex; gap: 100px">
		<layout.div layoutId="box" style={{ width: 100, height: 100, background: "red" }} />
		<AnimatePresence>
			{#if state}
				<!-- motion-sv: layoutCrossfade is named crossfade. -->
				<layout.div
					id="box"
					layoutId="box"
					crossfade={false}
					style={{
						width: 100,
						height: 100,
						background: "blue",
					}}
				/>
			{/if}
		</AnimatePresence>
	</div>
	<button onclick={layout.update.with(() => (state = !state))}>Toggle</button>
</MotionConfig>
