<script lang="ts">
	import { AnimatePresence, createLayoutMotion } from "motion-sv";

	/**
	 * An example of a component resuming animation and layout state using Shared layout and layoutId
	 */
	let count = $state(0);

	// motion-sv: layout animations need createLayoutMotion + an explicit update around the state change.
	const layout = createLayoutMotion();
	// useCycle(0, 1, 2, 3)
	const cycleCount = layout.update.with(() => (count = (count + 1) % 4));

	const animate = [
		{
			backgroundColor: "#09f",
			borderRadius: 10,
			opacity: 1,
		},
		{
			backgroundColor: "#90f",
			borderRadius: 100,
			opacity: 0.5,
		},
		{
			backgroundColor: "#f09",
			borderRadius: 0,
			opacity: 1,
		},
		{
			backgroundColor: "#9f0",
			borderRadius: 50,
			opacity: 0.5,
		},
	];

	const styles = [
		{
			width: 100,
			height: 100,
			top: 100,
		},
		{
			width: 200,
			height: 200,
			left: 100,
		},
		{
			width: 100,
			height: 100,
			left: "calc(100vw - 100px)",
		},
		{
			width: 200,
			height: 200,
		},
	];
</script>

<div
	style="position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; background: white; display: flex; justify-content: center; align-items: center"
>
	<AnimatePresence>
		{#key count}
			<layout.div
				initial={false}
				style={{
					position: "absolute",
					...styles[count],
				}}
				transition={{ duration: 10, ease: () => 0.25 }}
				animate={animate[count]}
				layoutId="box"
				id={`shape-${count}`}
				onclick={() => cycleCount()}
			/>
		{/key}
	</AnimatePresence>
</div>
