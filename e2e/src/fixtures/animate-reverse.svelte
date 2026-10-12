<script lang="ts">
	import { animate, createLayoutMotion } from "motion-sv";

	const boxStyles = {
		width: "100px",
		height: "100px",
		backgroundColor: "red",
	};

	// motion-sv: the `layout` prop is expressed by rendering through createLayoutMotion. React re-renders (and so
	// re-measures) the layout box on every state change: mirror that with layout.update + layoutDependency.
	const layout = createLayoutMotion();

	let count = $state(0);
	let result = $state("");

	$effect(() => {
		if (count % 2 === 0) return;

		const output: number[] = [];
		const controls = animate(0, 100, {
			duration: 0.5,
			ease: "linear",
			onUpdate: (v: number) => output.push(v),
			onComplete: () => {
				result = output[0] === 100 && output.length !== 2 ? "Success" : "Fail";
			},
		});
		controls.time = controls.duration;
		controls.speed = -1;

		return controls.stop;
	});
</script>

<div style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<button id="action" onclick={layout.update.with(() => count++)}>Animate</button>
	<input id="result" readonly value={result} />
	<layout.div class="box" style={boxStyles} layoutDependency={count} />
</div>
