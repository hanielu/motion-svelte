<script lang="ts">
	import { animate, animateMini, scroll } from "motion-sv";

	// motion-sv has no useAnimateMini hook: animateMini is called on the scope element directly,
	// which is what useAnimateMini's scoped animate does when given an element.
	function useAnimateMini(): [{ current: HTMLDivElement | null }, typeof animateMini] {
		const scope = $state<{ current: HTMLDivElement | null }>({ current: null });
		return [scope, animateMini];
	}

	const [scope, miniAnimate] = useAnimateMini();

	$effect(() => {
		if (!scope.current) return;

		const stopMiniScrollAnimation = scroll(
			miniAnimate(scope.current, {
				backgroundColor: ["#fff", "#000"],
				color: ["#000", "#fff"],
			})
		);

		const stopScrollAnimation = scroll(animate(scope.current, { x: [0, 100] }));

		return () => {
			stopMiniScrollAnimation();
			stopScrollAnimation();
		};
	});

	const spacer = "height: 100vh";
	const progressStyle =
		"position: fixed; top: 0px; left: 0px; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 80px; line-height: 80; font-weight: bold";
</script>

<div style="{spacer}; background-color: red"></div>
<div style="{spacer}; background-color: green"></div>
<div style="{spacer}; background-color: blue"></div>
<div style="{spacer}; background-color: yellow"></div>
<div bind:this={scope.current} id="color" style={progressStyle}>A</div>
