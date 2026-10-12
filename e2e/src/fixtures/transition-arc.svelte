<script lang="ts">
	import { arc, createLayoutMotion, LayoutGroup, motion } from "motion-sv";
	import { onMount } from "svelte";

	const ITEM_A = { left: 50, top: 200, width: 100, height: 50 };
	const ITEM_B = { left: 450, top: 200, width: 100, height: 50 };
	const ITEM_B_NEAR = { left: 60, top: 200, width: 100, height: 50 };

	type Item = typeof ITEM_A;
	const itemStyle = ({ left, top, width, height }: Item) =>
		`position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px`;

	/**
	 * URL variants:
	 *   default       — auto-toggling layout arc, real ease (visual demo)
	 *   freeze        — ease() => 0.5 to pin layout animation at midpoint
	 *   none          — like freeze but no `path` (linear baseline)
	 *   small         — sub-threshold distance, falls back to linear
	 *   keyframe      — keyframe arc with a Toggle button
	 *   oriented      — keyframe arc with rotate: true
	 *   freezeAt=N    — pin keyframe animation at fraction N (0..1)
	 *   interrupt     — auto-toggle layout fast, mid-flight (continuity demo)
	 *   axis-change   — interrupt across a dominant-axis change (continuity demo)
	 *   cw            — direction locked clockwise
	 *   ccw           — direction locked counter-clockwise
	 *   ping-pong     — keyframe arc bouncing between three points
	 */
	const params = new URLSearchParams(window.location.search);
	const variant = params.get("variant") || "default";

	// LayoutArc
	const isSmall = variant === "small";
	const itemB = isSmall ? ITEM_B_NEAR : ITEM_B;
	const isFreeze = variant === "freeze" || variant === "none" || isSmall;
	const direction = variant === "cw" ? "cw" : variant === "ccw" ? "ccw" : undefined;
	const ease = isFreeze ? () => 0.5 : undefined;
	const duration = isFreeze ? 4 : 1.2;

	// Created once so its closure (prevBulgeSign) survives renders.
	const layoutPath = variant === "none" ? undefined : arc({ strength: 1, direction });

	const transition: any = { duration, ...(ease ? { ease } : {}) };
	if (layoutPath) transition.path = layoutPath;

	let active = $state<"a" | "b">("a");

	// motion-sv: layoutId animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const toggleActive = layout.update.with(() => (active = active === "a" ? "b" : "a"));

	onMount(() => {
		if (variant === "keyframe" || variant === "oriented" || variant === "ping-pong") return;
		if (variant === "axis-change" || variant === "rotate-compose") return;
		if (isFreeze) return;
		const interval = variant === "interrupt" ? 600 : 1500;
		const id = window.setInterval(toggleActive, interval);
		return () => window.clearInterval(id);
	});

	// KeyframeArc / RotateCompose
	let target = $state<"a" | "b">("a");
	const freezeAt = params.has("freezeAt") ? Number(params.get("freezeAt")) : params.has("freeze") ? 0.5 : undefined;
	const keyframePath = arc({ strength: 1, rotate: variant === "oriented" });
	const rotateComposePath = arc({ strength: 1, rotate: true });

	// PingPong
	const positions = [
		{ x: 0, y: 0 },
		{ x: 400, y: 0 },
		{ x: 200, y: 300 },
	];
	let i = $state(0);
	const pingPongPath = arc({ strength: 0.7, rotate: 0.5 });

	// AxisChange
	let phase = $state<0 | 1 | 2 | 3>(0);
	const axisChangePath = arc({ strength: 0.7 });
	const points = [
		{ x: 0, y: 0 },
		{ x: 300, y: 50 },
		{ x: 350, y: 350 },
		{ x: 0, y: 300 },
	];

	onMount(() => {
		if (variant === "ping-pong") {
			const id = window.setInterval(() => (i = (i + 1) % positions.length), 1400);
			return () => window.clearInterval(id);
		}
		if (variant === "axis-change") {
			const id = window.setInterval(() => (phase = ((phase + 1) % 4) as 0 | 1 | 2 | 3), 1300);
			return () => window.clearInterval(id);
		}
	});
</script>

{#snippet hud(variant: string)}
	<div
		style="position: fixed; bottom: 12px; left: 12px; padding: 6px 10px; background: #111; color: #fff; font: 12px/1.4 ui-monospace, monospace; border-radius: 4px; opacity: 0.85"
	>
		variant=<b>{variant}</b>
	</div>
{/snippet}

<div id="container" style="position: relative; width: 100vw; height: 100vh">
	{#if variant === "keyframe" || variant === "oriented"}
		{@render hud(variant === "oriented" ? "oriented" : "keyframe")}
		<button
			id="toggle"
			onclick={() => (target = target === "a" ? "b" : "a")}
			style="position: fixed; top: 16px; left: 16px"
		>
			Toggle
		</button>
		<motion.div
			id="indicator"
			animate={{ x: target === "a" ? 0 : 400, y: 0 }}
			transition={{
				duration: freezeAt !== undefined ? 4 : 1.2,
				...(freezeAt !== undefined ? { ease: () => freezeAt } : {}),
				path: keyframePath,
			}}
			style={{
				position: "absolute",
				top: 200,
				left: 50,
				width: 100,
				height: 100,
				background: "red",
			}}
		/>
	{:else if variant === "ping-pong"}
		{@render hud("ping-pong")}
		<motion.div
			id="indicator"
			animate={positions[i]}
			transition={{ duration: 1.2, path: pingPongPath }}
			style={{
				position: "absolute",
				top: 100,
				left: 100,
				width: 80,
				height: 80,
				background: "tomato",
			}}
		/>
	{:else if variant === "axis-change"}
		{@render hud("axis-change")}
		<motion.div
			id="indicator"
			animate={points[phase]}
			transition={{ duration: 1.1, path: axisChangePath }}
			style={{
				position: "absolute",
				top: 100,
				left: 100,
				width: 60,
				height: 60,
				background: "tomato",
			}}
		/>
	{:else if variant === "rotate-compose"}
		{@render hud("rotate-compose")}
		<button
			id="toggle"
			onclick={() => (target = target === "a" ? "b" : "a")}
			style="position: fixed; top: 16px; left: 16px"
		>
			Toggle
		</button>
		<motion.div
			id="indicator"
			animate={{
				x: target === "a" ? 0 : 400,
				y: 0,
				rotate: target === "a" ? 0 : 90,
			}}
			transition={{ duration: 4, ease: () => 0.5, path: rotateComposePath }}
			style={{
				position: "absolute",
				top: 200,
				left: 50,
				width: 100,
				height: 100,
				background: "red",
			}}
		/>
	{:else}
		{@render hud(variant)}
		<button id="toggle" onclick={toggleActive} style="position: fixed; top: 16px; left: 16px">Toggle</button>
		<LayoutGroup id="arc-test">
			<div id="item-a" style={itemStyle(ITEM_A)}>
				{#if active === "a"}
					<layout.div
						id="indicator"
						layoutId="indicator"
						{transition}
						style={{ width: 100, height: 100, background: "red" }}
					/>
				{/if}
			</div>
			<div id="item-b" style={itemStyle(itemB)}>
				{#if active === "b"}
					<layout.div
						id="indicator"
						layoutId="indicator"
						{transition}
						style={{ width: 100, height: 100, background: "red" }}
					/>
				{/if}
			</div>
		</LayoutGroup>
	{/if}
</div>
