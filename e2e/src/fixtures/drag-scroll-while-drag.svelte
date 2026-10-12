<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Test for scroll-while-drag feature.
	 * Verifies that dragging elements stay attached to the cursor
	 * when scrolling occurs during drag.
	 *
	 * URL params:
	 * - window=true: Test window scroll instead of element scroll
	 */

	const params = new URLSearchParams(window.location.search);
	const useWindowScroll = params.get("window") === "true";

	const scrollableStyle =
		"position: fixed; top: 0; left: 0; width: 500px; height: 400px; overflow: auto; background: #f0f0f0";
	const contentStyle = "height: 1500px; width: 800px; padding-top: 50px; padding-left: 50px";
	const windowContentStyle = "height: 2000px; width: 100%; padding-top: 50px; padding-left: 50px; background: #f0f0f0";
	const boxStyle = {
		width: 100,
		height: 100,
		background: "#ff0066",
		borderRadius: 10,
	};
</script>

{#if useWindowScroll}
	<!-- Window scroll test: draggable in a tall document -->
	<div style={windowContentStyle}>
		<motion.div id="draggable" data-testid="draggable" drag dragElastic={0} dragMomentum={false} style={boxStyle} />
	</div>
{:else}
	<!-- Element scroll test: draggable in a scrollable container -->
	<div id="scrollable" data-testid="scrollable" style={scrollableStyle}>
		<div style={contentStyle}>
			<motion.div id="draggable" data-testid="draggable" drag dragElastic={0} dragMomentum={false} style={boxStyle} />
		</div>
	</div>
{/if}
