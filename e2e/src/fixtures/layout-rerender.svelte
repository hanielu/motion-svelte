<script lang="ts">
	import { createLayoutMotion, motion, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const parent = params.get("parent") || false;
	let state = $state(0);
	const backgroundColor = useMotionValue("red");
	const renderCount = useMotionValue(0);
	// React renders a MotionValue child as live text; Svelte needs a reactive read.
	const renderCountText = useCurrentMotionValue(renderCount);

	const layout = createLayoutMotion();
	const update = layout.update.with((value: number) => (state = value));

	$effect(() => {
		if (state === 1) {
			setTimeout(() => update(2), 50);
		}
	});

	const box = {
		position: "absolute",
		top: 100,
		left: 100,
		background: "red",
	};

	const a = {
		...box,
		width: 100,
		height: 200,
	};

	const b = {
		...box,
		top: 100,
		left: 200,
		width: 300,
		height: 300,
	};
</script>

{#snippet content()}
	<layout.div
		id="box"
		data-testid="box"
		style={{ ...(state ? a : b), backgroundColor }}
		transition={{ duration: 1 }}
		onLayoutAnimationStart={() => renderCount.set(renderCount.get() + 1)}
	/>
{/snippet}

<button onclick={() => update(state + 1)}>Update</button>
<motion.pre id="render-count">{renderCountText.current}</motion.pre>
<!-- motion-sv: <layout.*> forces layout={true}, so layout={false} stays a plain motion.div. -->
{#if Boolean(parent)}
	<layout.div
		style={{
			position: "relative",
			width: 500,
			height: state ? 500 : 400,
		}}
	>
		{@render content()}
	</layout.div>
{:else}
	<motion.div
		layout={Boolean(parent)}
		style={{
			position: "relative",
			width: 500,
			height: state ? 500 : 400,
		}}
	>
		{@render content()}
	</motion.div>
{/if}
