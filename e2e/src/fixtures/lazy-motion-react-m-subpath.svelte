<script lang="ts">
	// Upstream imports `m` from the separately-bundled "motion/react-m" subpath; motion-sv ships a single entry.
	import { LazyMotion, domAnimation, m } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * Test for GitHub issue #3091
	 *
	 * LazyMotion (from `motion/react`) wrapping `m.div` from the `motion/react-m`
	 * subpath. The LazyMotion-supplied renderer and feature definitions must reach
	 * the m component even though the m components come from a separately-bundled
	 * subpath, otherwise the m component renders nothing animated.
	 */
	let ref = $state<HTMLElement | SVGElement | null>(null);

	onMount(() => {
		const id = setTimeout(() => {
			if (ref && !ref.dataset.animationComplete) {
				ref.dataset.animationFailed = "true";
			}
		}, 1000);
		return () => clearTimeout(id);
	});
</script>

<LazyMotion features={domAnimation}>
	<m.div
		id="box"
		bind:ref
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.1 }}
		onAnimationComplete={() => {
			if (ref) {
				ref.dataset.animationComplete = "true";
			}
		}}
		style={{
			width: 100,
			height: 100,
			background: "red",
		}}
	/>
</LazyMotion>
