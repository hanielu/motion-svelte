<script lang="ts">
	import { useMotionValueEvent, useScroll } from "motion-sv";

	/**
	 * Reproduction for #2851 — useScroll target ref hydrated after the hook's
	 * own effects run (e.g. via querySelector in an effect declared after
	 * useScroll). Before the fix, useScroll fell back to the whole-window scroll
	 * because the target was still null when its effect ran.
	 *
	 * Upstream renders the reproduction in a nested ReactDOM root to escape
	 * StrictMode's double-mount; Svelte has no StrictMode, so it renders directly.
	 */
	let targetRef = $state<HTMLDivElement | null>(null);

	const { scrollYProgress } = useScroll({
		get target() {
			return targetRef;
		},
		offset: ["start end", "end start"],
	});

	$effect(() => {
		targetRef = document.querySelector<HTMLDivElement>("#target");
	});

	let progress = $state(0);
	useMotionValueEvent(scrollYProgress, "change", (latest) => (progress = latest));

	const topSpacer = "height: 200vh";
	const bottomSpacer = "height: 100vh";
	const targetStyle = "height: 100vh; background: red";
	const progressStyle = "position: fixed; top: 0px; left: 0px; background: white; z-index: 10";
</script>

<div>
	<div style={topSpacer}></div>
	<div id="target" style={targetStyle}></div>
	<div style={bottomSpacer}></div>
	<div id="progress" style={progressStyle}>{progress.toFixed(4)}</div>
</div>
