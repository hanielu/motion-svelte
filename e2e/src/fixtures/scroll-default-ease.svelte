<script lang="ts">
	import { animateMini, pipe, scroll, spring, useAnimate, type AnimationOptions } from "motion-sv";
	import { untrack } from "svelte";

	type Scope = { current: Element | null | undefined };

	function scrollAnimate(scope: Scope, animate: any, options?: AnimationOptions) {
		if (!scope.current) return () => {};

		return scroll(animate(scope.current, { transform: ["translate(0px)", "translateX(100px)"] }, options));
	}

	// motion-sv has no useAnimateMini hook: animateMini is called on each scope element directly,
	// which is what useAnimateMini's scoped animate does when given an element.
	function useAnimateMini(): [Scope, typeof animateMini] {
		const scope = $state<Scope>({ current: null });
		return [scope, animateMini];
	}

	const [scopeDefault, miniAnimateDefault] = useAnimateMini();
	const [scopeEaseOut, miniAnimateEaseOut] = useAnimateMini();
	const [scopeSpring, miniAnimateSpring] = useAnimateMini();
	const [scopeAnimateDefault, animateDefault] = useAnimate();
	const [scopeAnimateEaseOut, animateEaseOut] = useAnimate();
	const [scopeAnimateSpring, animateSpring] = useAnimate();
	const [scopeAnimateMainThreadDefault, animateMainThreadDefault] = useAnimate();
	const [scopeAnimateMainThreadEaseOut, animateMainThreadEaseOut] = useAnimate();
	const [scopeAnimateMainThreadSpring, animateMainThreadSpring] = useAnimate();

	// useEffect(..., []) has no dependencies, hence untrack: the animations shouldn't restart when state they read changes.
	$effect(() =>
		untrack(
			() =>
				pipe(
					scrollAnimate(scopeDefault, miniAnimateDefault),
					scrollAnimate(scopeEaseOut, miniAnimateEaseOut, {
						ease: "easeOut",
					}),
					scrollAnimate(scopeSpring, miniAnimateSpring, { type: spring }),
					scrollAnimate(scopeAnimateDefault, animateDefault),
					scrollAnimate(scopeAnimateEaseOut, animateEaseOut, {
						ease: "easeOut",
					}),
					scrollAnimate(scopeAnimateSpring, animateSpring, { type: spring }),
					scrollAnimate(scopeAnimateMainThreadDefault, animateMainThreadDefault, {
						repeatDelay: 0.0001,
					}),
					scrollAnimate(scopeAnimateMainThreadEaseOut, animateMainThreadEaseOut, {
						ease: "easeOut",
						repeatDelay: 0.0001,
					}),
					scrollAnimate(scopeAnimateMainThreadSpring, animateMainThreadSpring, {
						type: spring,
						repeatDelay: 0.0001,
					})
				) as () => void
		)
	);

	const containerStyle = "height: 500vh";
	const scrollContainer = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%";
	const progressStyle = "width: 100px; height: 100px; background-color: white; color: black";
</script>

<div style={containerStyle}>
	<div style={scrollContainer}>
		<div bind:this={scopeDefault.current} style={progressStyle}>mini - default</div>
		<div bind:this={scopeEaseOut.current} style={progressStyle}>mini - easeOut</div>
		<div bind:this={scopeSpring.current} style={progressStyle}>mini - spring</div>
		<div bind:this={scopeAnimateDefault.current} style={progressStyle}>animate - default</div>
		<div bind:this={scopeAnimateEaseOut.current} style={progressStyle}>animate - easeOut</div>
		<div bind:this={scopeAnimateSpring.current} style={progressStyle}>animate - spring</div>
		<div bind:this={scopeAnimateMainThreadDefault.current} style={progressStyle}>animate main thread - default</div>
		<div bind:this={scopeAnimateMainThreadEaseOut.current} style={progressStyle}>animate main thread - easeOut</div>
		<div bind:this={scopeAnimateMainThreadSpring.current} style={progressStyle}>animate main thread - spring</div>
	</div>
</div>
