<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Reproduction from issue #3233:
	 * Multiple AnimatePresence instances with a shared layoutId child that
	 * cycles through them. onExitComplete should fire exactly once per exit.
	 */
	const maxNum = 4;

	const boxStyle = "width: 100px; height: 100px; background: aqua; margin-bottom: 20px; position: relative;";

	const measurerStyle = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		border: "1px solid",
		zIndex: 1,
	};

	let startIndex = $state(0);
	let doneCount = $state(0);
	const onDone = () => (doneCount += 1);

	// Upstream's <Boxes> resets currentIndex whenever startIndex changes (state derived during render).
	let currentIndex = $derived(startIndex);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	const setCurrentIndex = layout.update.with((index: number) => (currentIndex = index));

	onMount(() => {
		if (startIndex < maxNum - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	});
</script>

<div>
	{#each Array(maxNum).fill(0) as _, index (index)}
		<div style={boxStyle}>
			<AnimatePresence onExitComplete={() => index === maxNum - 1 && onDone()}>
				{#if currentIndex === index}
					<layout.div
						layoutId="measurer"
						style={measurerStyle}
						onLayoutAnimationComplete={() => {
							if (currentIndex < maxNum - 1) {
								setCurrentIndex(currentIndex + 1);
							}
						}}
					/>
				{/if}
			</AnimatePresence>
		</div>
	{/each}
</div>
<span id="done-count">{doneCount}</span>
<button id="start-1" onclick={layout.update.with(() => (startIndex = 1))}>start 1</button>
