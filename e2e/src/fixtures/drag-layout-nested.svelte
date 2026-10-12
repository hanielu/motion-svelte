<script lang="ts">
	import { createLayoutMotion, motion } from "motion-sv";
	import { untrack } from "svelte";

	let count = $state(0);
	const params = new URLSearchParams(window.location.search);
	let parentDrag: boolean | "x" | "y" = (params.get("parentDrag") as "x" | "y") || true;
	let childDrag: boolean | "x" | "y" = (params.get("childDrag") as "x" | "y") || true;
	const parentLayout = params.get("parentLayout") ? true : undefined;
	const childLayout = params.get("childLayout") ? true : undefined;
	const constraints = Boolean(params.get("constraints"));
	const animation = Boolean(params.get("animation"));
	const bothAxes = Boolean(params.get("bothAxes"));

	if (bothAxes) {
		parentDrag = "y";
		childDrag = "x";
	}

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	// `layout.*` forces `layout: true`, so it only replaces the motion components upstream renders with `layout`.
	const layout = createLayoutMotion();
	const Parent = parentLayout ? layout.div : motion.div;
	const Child = childLayout ? layout.div : motion.div;

	// Trigger layout projection in the child
	const bump = layout.update.with(() => (count = count + 1));
	$effect(() => untrack(bump));

	const box = {
		position: "absolute",
		top: 0,
		left: 0,
		background: "#ff0055",
	};

	const b = {
		...box,
		top: 100,
		left: 100,
		width: 300,
		height: 300,
		borderRadius: 10,
	};

	const a = {
		position: "relative",
		top: 50,
		left: 50,
		width: 600,
		height: 200,
		background: "#ffcc00",
		borderRadius: 10,
	};

	const c = {
		position: "relative",
		top: 50,
		left: 50,
		width: 100,
		height: 100,
		background: "#ffaa00",
		borderRadius: 10,
	};
</script>

<div>
	<Parent
		id="parent"
		drag={parentDrag}
		dragMomentum={animation}
		dragElastic={constraints && animation ? 0.5 : false}
		dragConstraints={constraints && { top: -10, right: 100 }}
		layout={parentLayout}
		layoutDependency={count}
		style={b}
	>
		<Child
			id="child"
			drag={childDrag}
			dragMomentum={animation}
			dragElastic={constraints && animation ? 0.5 : false}
			dragConstraints={constraints && { top: 0, left: -100, right: 100 }}
			layout={childLayout}
			layoutDependency={count}
			style={a}
		>
			<layout.div id="control" layoutId="test" layoutDependency={count} style={c} />
		</Child>
	</Parent>
</div>
