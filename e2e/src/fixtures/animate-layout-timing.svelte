<script lang="ts">
	import { animate, createLayoutMotion } from "motion-sv";

	let count = $state(0);
	let result = $state("");

	const layout = createLayoutMotion();

	$effect(() => {
		if (count % 2 === 0) return;

		const output: number[] = [];
		const controls = animate(0, 100, {
			duration: 0.5,
			ease: "linear",
			onUpdate: (v: number) => output.push(v),
			onComplete: () => (result = output[1] !== 100 && output.length !== 2 ? "Success" : "Fail"),
		});
		return controls.stop;
	});
</script>

<section style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<button id="action" onclick={layout.update.with(() => (count += 1))}>Animate</button>
	<input id="result" readonly value={result} />
	<!-- motion-sv: layoutDependency gives the stay-mounted box a reactive trigger on every re-render, like React's. -->
	<layout.div
		layoutDependency={count}
		style={{
			width: "100px",
			height: "100px",
			backgroundColor: "red",
		}}
	/>
</section>
