<script lang="ts">
	import { useAnimate } from "motion-sv";
	import { onMount } from "svelte";

	const [scope, animate] = useAnimate();

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
		const controls = animate(scope.current, { opacity: 0 }, { duration: 2 });
		return () => {
			try {
				controls.cancel();
			} catch (e) {
				if (scope.current) {
					scope.current.innerHTML = "error";
				}
				console.error(e);
			}
		};
	});
</script>

<div bind:this={scope.current} class="box" style="width: 2rem; height: 2rem; background: red"></div>
