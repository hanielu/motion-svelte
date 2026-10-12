<script lang="ts">
	import { AnimatePresence, createLayoutMotion, rootProjectionNode } from "motion-sv";

	/**
	 * motion-sv doesn't export useInstantLayoutTransition; this is upstream's implementation
	 * (framer-motion/src/projection/use-instant-layout-transition.ts) on motion-dom's rootProjectionNode.
	 */
	function useInstantLayoutTransition() {
		return (callback?: () => void) => {
			if (!rootProjectionNode.current) return;
			rootProjectionNode.current.isUpdating = false;
			rootProjectionNode.current.blockUpdate();
			callback && callback();
		};
	}

	const transition = {
		default: { duration: 10, ease: () => 0.5 },
		opacity: { duration: 10, ease: () => 0.1 },
	};

	const startTransition = useInstantLayoutTransition();
	const params = new URLSearchParams(window.location.search);
	const type = params.get("type") || true;
	let bgColor = $state("#f00");
	let state = $state(false);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();

	const instantTransit = layout.update.with(() => {
		startTransition(() => {
			bgColor = "#00f";
		});
		state = !state;
	});
	const toggle = layout.update.with(() => (state = !state));

	const box = {
		position: "absolute",
		top: 0,
		left: 0,
	};

	const a = {
		...box,
		width: 100,
		height: 200,
		borderRadius: 0,
	};

	const b = {
		...box,
		top: 100,
		left: 200,
		width: 300,
		height: 300,
		borderRadius: 20,
	};
</script>

<!-- a -> instant -> b -->
<!-- b -> animate -> a -->
<AnimatePresence>
	<layout.div
		id="a"
		data-testid="box"
		layoutId="box"
		layout={type}
		style={{ ...a, background: bgColor }}
		onclick={instantTransit}
		{transition}
		layoutDependency={state}
	/>
	{#if state}
		<layout.div id="b" layoutId="box" style={{ ...b, background: bgColor }} onclick={toggle} />
	{/if}
</AnimatePresence>
