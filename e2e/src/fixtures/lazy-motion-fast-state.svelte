<script lang="ts">
	import { m, LazyMotion, domAnimation } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Test for GitHub issue #2759
	 * When LazyMotion features load asynchronously and state changes occur before
	 * features load, the enter animation should still fire (not snap to final value).
	 */
	const variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	let isVisible = $state(false);
	let boxRef = $state<HTMLElement | SVGElement | null>(null);

	// Simulate state change that occurs before features load
	onMount(() => {
		const timer = setTimeout(() => {
			isVisible = true;
		}, 5); // State changes after 5ms
		return () => clearTimeout(timer);
	});
</script>

<LazyMotion
	features={() =>
		new Promise((resolve) => {
			// Features load after 50ms (longer than the 5ms state change)
			setTimeout(() => {
				resolve(domAnimation);
			}, 50);
		})}
>
	<m.div
		id="box"
		bind:ref={boxRef}
		initial={false}
		animate={isVisible ? "visible" : "hidden"}
		{variants}
		transition={{ duration: 0.1 }}
		onAnimationComplete={() => {
			if (boxRef) {
				boxRef.dataset.animationComplete = "true";
			}
		}}
		style={{
			width: 100,
			height: 100,
			background: "red",
		}}
	/>
</LazyMotion>
