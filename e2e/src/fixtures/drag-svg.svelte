<script lang="ts">
	import { createLayoutMotion, motion } from "motion-sv";

	// It's important for this test to only trigger a single rerender while dragging (in response to onDragStart) of draggable component.

	const params = new URLSearchParams(window.location.search);
	const axis = params.get("axis") as "x" | "y" | null;
	const lock = params.get("lock");
	const top = parseFloat(params.get("top")!) || undefined;
	const left = parseFloat(params.get("left")!) || undefined;
	const right = parseFloat(params.get("right")!) || undefined;
	const bottom = parseFloat(params.get("bottom")!) || undefined;
	const layout = params.get("layout") || undefined;

	// motion-sv: `layout` needs createLayoutMotion (it forces layout: true). It never changes, so no layout.update().
	const Circle = layout ? createLayoutMotion().circle : motion.circle;
</script>

<svg style="width: 500px; height: 500px">
	<Circle
		id="box"
		data-testid="draggable"
		drag={axis ? axis : true}
		dragElastic={0}
		dragMomentum={false}
		dragConstraints={{ top, left, right, bottom }}
		dragDirectionLock={!!lock}
		fill="red"
		cx={50}
		cy={50}
		r={20}
	/>
</svg>
