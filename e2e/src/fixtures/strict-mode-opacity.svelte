<script lang="ts">
	import { useAnimate } from "motion-sv";
	import { onMount } from "svelte";

	const [scope, animate] = useAnimate();
	let controls: ReturnType<typeof animate> | null = null;
	let shouldAnimate = $state(false);

	/**
	 * Upstream renders inside React's <StrictMode>, which runs every effect setup → cleanup → setup synchronously
	 * on mount. Its cleanup pass runs useAnimate's unmount cleanup first (stopping the scope's animations), then
	 * this effect's cleanup. Svelte has no StrictMode, so replay that sequence.
	 */
	function strictModeEffect(setup: () => () => void) {
		onMount(() => {
			const cleanup = setup();
			scope.animations.forEach((animation) => animation.stop());
			scope.animations.length = 0;
			cleanup();
			return setup();
		});
	}

	strictModeEffect(() => {
		controls = animate(scope.current, { opacity: 1 }, { duration: 0.5, autoplay: false });

		return () => controls?.stop();
	});

	$effect(() => {
		if (!controls || !shouldAnimate) return;
		controls.play();
	});
</script>

<div id="box" bind:this={scope.current} style="width: 100px; height: 100px; background: red; opacity: 0"></div>
<button id="trigger" onclick={() => (shouldAnimate = true)}>Animate</button>
