<script lang="ts">
	import { useAnimate } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Reproduction for #3158: spring animations with animation sequences
	 * should not throw "Only two keyframes currently supported with spring
	 * and inertia animations".
	 */
	const [scope, animate] = useAnimate();
	let result = $state("");

	onMount(() => {
		animate(
			[
				["#box-a", { x: [0, 20], y: [0, 20] }],
				["#box-b", { scale: [1, 2] }],
			],
			{ defaultTransition: { type: "spring" } }
		)
			.then(() => (result = "Success"))
			.catch(() => (result = "Error"));
	});
</script>

<div bind:this={scope.current} style="padding: 100px">
	<div id="box-a" style="width: 100px; height: 100px; background-color: red"></div>
	<div id="box-b" style="width: 100px; height: 100px; background-color: blue"></div>
	<input id="result" readonly value={result} />
</div>
