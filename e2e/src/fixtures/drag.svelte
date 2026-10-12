<script lang="ts">
	import { motion } from "motion-sv";

	function getValueParam(params: URLSearchParams, name: string, isPercentage: boolean) {
		const param = params.get(name);
		if (!param) return 0;
		if (isPercentage) {
			return param + "%";
		} else {
			return parseFloat(param);
		}
	}

	// It's important for this test to only trigger a single rerender while dragging (in response to onDragStart) of draggable component.
	const params = new URLSearchParams(window.location.search);
	const axis = params.get("axis") as "x" | "y" | null;
	const lock = params.get("lock");
	const isPercentage = Boolean(params.get("percentage"));
	const top = parseFloat(params.get("top")!) || undefined;
	const left = parseFloat(params.get("left")!) || undefined;
	const right = parseFloat(params.get("right")!) || undefined;
	const bottom = parseFloat(params.get("bottom")!) || undefined;
	const showChild = Boolean(params.get("showChild"));
	const returnParam = params.get("return");
	const snapToOrigin: boolean | "x" | "y" = returnParam === "x" || returnParam === "y" ? returnParam : Boolean(returnParam);
	const x = getValueParam(params, "x", isPercentage);
	const y = getValueParam(params, "y", isPercentage);
	const layout = params.get("layout") || undefined;

	// We do this to test when scroll position isn't 0/0
	$effect(() => {
		window.scrollTo(0, 100);
	});
</script>

<div style="height: 2000px; padding-top: 100px">
	<motion.div
		id="box"
		data-testid="draggable"
		drag={axis ? axis : true}
		dragElastic={0}
		dragMomentum={false}
		dragConstraints={{ top, left, right, bottom }}
		dragSnapToOrigin={snapToOrigin as boolean}
		dragDirectionLock={!!lock}
		layout={layout as any}
		initial={{
			width: 50,
			height: 50,
			background: "red",
			x,
			y,
		}}
	>
		{#if showChild}
			<div data-testid="draggable-child" style="width: 50px; height: 50px; background: blue"></div>
		{/if}
	</motion.div>
</div>
