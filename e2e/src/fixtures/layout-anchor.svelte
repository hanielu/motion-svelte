<script lang="ts">
	/**
	 * Test for layoutAnchor prop with custom anchor point controls.
	 *
	 * Click the parent boxes to toggle expanded/collapsed.
	 * Use the sliders to adjust the anchor point of the green child.
	 * The red child has no anchor for comparison.
	 */
	import { createLayoutMotion } from "motion-sv";

	let expanded = $state(false);
	let anchorX = $state(0.5);
	let anchorY = $state(0.5);

	const layout = createLayoutMotion();
	const toggle = layout.update.with(() => (expanded = !expanded));

	const presets = [
		{ label: "TL", x: 0, y: 0 },
		{ label: "TC", x: 0.5, y: 0 },
		{ label: "TR", x: 1, y: 0 },
		{ label: "CL", x: 0, y: 0.5 },
		{ label: "C", x: 0.5, y: 0.5 },
		{ label: "CR", x: 1, y: 0.5 },
		{ label: "BL", x: 0, y: 1 },
		{ label: "BC", x: 0.5, y: 1 },
		{ label: "BR", x: 1, y: 1 },
	];

	const parentStyle = $derived({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: expanded ? 400 : 200,
		height: expanded ? 400 : 200,
		background: "rgba(0,0,0,0.1)",
		cursor: "pointer",
	});

	const parentTransition = {
		type: "tween",
		ease: "linear",
		duration: 1,
	} as const;

	const childTransition = {
		type: "tween",
		ease: "linear",
		duration: 1,
		delay: 0.5,
	} as const;

	const labelStyle = "font-family: system-ui, sans-serif; font-size: 13px; margin-bottom: 8px; color: #aaa";
</script>

<div
	style="position: fixed; top: 10px; right: 10px; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); z-index: 10; color: #333; font-family: system-ui, sans-serif; font-size: 14px; min-width: 200px"
>
	<div style="font-weight: 600; margin-bottom: 12px">layoutAnchor</div>
	<label style="display: block; margin-bottom: 8px">
		x: {anchorX.toFixed(2)}
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={anchorX}
			oninput={(e) => (anchorX = parseFloat(e.currentTarget.value))}
			style="display: block; width: 100%"
		/>
	</label>
	<label style="display: block; margin-bottom: 8px">
		y: {anchorY.toFixed(2)}
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={anchorY}
			oninput={(e) => (anchorY = parseFloat(e.currentTarget.value))}
			style="display: block; width: 100%"
		/>
	</label>
	<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px">
		{#each presets as preset (preset.label)}
			{@const active = anchorX === preset.x && anchorY === preset.y}
			<button
				onclick={() => {
					anchorX = preset.x;
					anchorY = preset.y;
				}}
				style="padding: 4px 8px; border: {active ? '2px solid #007aff' : '1px solid #ccc'}; border-radius: 4px; background: {active
					? '#e8f0fe'
					: '#fff'}; cursor: pointer; font-size: 12px"
			>
				{preset.label}
			</button>
		{/each}
	</div>
	<div
		style="margin-top: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 12px; font-family: monospace"
	>
		{`{ x: ${anchorX}, y: ${anchorY} }`}
	</div>
</div>

<div style="display: flex; gap: 40px; padding: 20px">
	<div>
		<div style={labelStyle}>With layoutAnchor (green)</div>
		<layout.div id="parent" onclick={toggle} style={parentStyle} transition={parentTransition}>
			<layout.div
				id="child-anchored"
				layoutAnchor={{ x: anchorX, y: anchorY }}
				style={{
					width: 50,
					height: 50,
					background: "green",
				}}
				transition={childTransition}
			/>
		</layout.div>
	</div>

	<div>
		<div style={labelStyle}>Without layoutAnchor (red)</div>
		<layout.div id="parent-no-anchor" onclick={toggle} style={parentStyle} transition={parentTransition}>
			<layout.div
				id="child-no-anchor"
				style={{
					width: 50,
					height: 50,
					background: "red",
				}}
				transition={childTransition}
			/>
		</layout.div>
	</div>

	<div>
		<div style={labelStyle}>layoutAnchor={"{false}"} (blue)</div>
		<layout.div id="parent-false-anchor" onclick={toggle} style={parentStyle} transition={parentTransition}>
			<layout.div
				id="child-false-anchor"
				layoutAnchor={false}
				style={{
					width: 50,
					height: 50,
					background: "dodgerblue",
				}}
				transition={childTransition}
			/>
		</layout.div>
	</div>
</div>
