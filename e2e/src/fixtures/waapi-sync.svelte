<script lang="ts">
	import { animate, motion, useMotionValue, type ValueAnimationTransition } from "motion-sv";
	import { onMount } from "svelte";

	const opacity = useMotionValue(0);

	let waapiRef = $state<HTMLElement | SVGElement | null>(null);
	let syncRef = $state<HTMLElement | SVGElement | null>(null);

	// Upstream renders MotionValue children; motion-sv children are snippets, so hold the text in state.
	let waapiStartTime = $state("--");
	let syncStartTime = $state("--");
	let waapiExplicitStartTime = $state("--");
	let syncExplicitStartTime = $state("--");

	onMount(() => {
		const settings: ValueAnimationTransition = {
			duration: 2,
			ease: "linear",
		};

		if (!waapiRef) return;
		if (!syncRef) return;

		const waapiAnimation = animate(waapiRef, { opacity: [0, 1] }, settings);
		const syncAnimation = animate(syncRef, { opacity: [0, 1] }, settings);

		const startTime = 101;

		const waapiExplicitAnimation = animate(
			waapiRef,
			{ filter: ["blur(0px)", "blur(1px)"] },
			{ ...settings, startTime }
		);
		const syncExplicitAnimation = animate(syncRef, { x: [0, 100] }, { ...settings, startTime });

		const timeout = setTimeout(() => {
			waapiStartTime = waapiAnimation.startTime?.toString() || "waapi start time not available";
			syncStartTime = syncAnimation.startTime?.toString() || "sync start time not available";
			waapiExplicitStartTime =
				waapiExplicitAnimation.startTime?.toString() || "waapi explicit start time not available";
			syncExplicitStartTime = syncExplicitAnimation.startTime?.toString() || "sync explicit start time not available";
		}, 1000);

		return () => {
			waapiAnimation.stop();
			syncAnimation.stop();
			waapiExplicitAnimation.stop();
			syncExplicitAnimation.stop();
			clearTimeout(timeout);
		};
	});
</script>

<section style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<motion.div
		bind:ref={waapiRef}
		style={{
			width: "100px",
			height: "100px",
			backgroundColor: "red",
			opacity: 0,
		}}
	/>
	<motion.div
		bind:ref={syncRef}
		style={{
			width: "100px",
			height: "100px",
			backgroundColor: "red",
			opacity,
			y: 0,
		}}
	/>
	<motion.pre id="waapi-start-time" class="auto-timer waapi-timer">{waapiStartTime}</motion.pre>
	<motion.pre id="sync-start-time" class="auto-timer sync-timer">{syncStartTime}</motion.pre>
	<motion.pre id="waapi-explicit-start-time" class="explicit-timer waapi-timer">{waapiExplicitStartTime}</motion.pre>
	<motion.pre id="sync-explicit-start-time" class="explicit-timer sync-timer">{syncExplicitStartTime}</motion.pre>
</section>
