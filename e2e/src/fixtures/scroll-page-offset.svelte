<script lang="ts">
	import { animate, motion, scroll, useScroll, useTransform } from "motion-sv";
	import { onMount } from "svelte";

	/**
	 * A page scroll() and useScroll() with an offset and no target. The offset
	 * starts the animations at 1000px of scroll and ends them at 2000px.
	 *
	 * opacity runs on WAAPI, so where supported the #box animation and the
	 * accelerated useScroll opacity can use a native ScrollTimeline. x never
	 * runs on WAAPI, so #js-box always uses the JS path.
	 */
	const { scrollYProgress } = useScroll({ offset: ["1000px", "2000px"] });
	const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

	onMount(() => {
		const transition = { ease: "linear" } as const;

		const stops = [
			scroll(animate("#box", { opacity: [0, 1] }, transition), {
				offset: ["1000px", "2000px"],
			}),
			scroll(animate("#js-box", { x: [0, 100] }, transition), {
				offset: ["1000px", "2000px"],
			}),
		];

		return () => stops.forEach((stop) => stop());
	});

	const spacer = "height: 100vh";

	const box = {
		position: "fixed",
		left: 0,
		width: 100,
		height: 100,
		backgroundColor: "red",
	};
	const boxCss = "position: fixed; left: 0; width: 100px; height: 100px; background-color: red";
</script>

{@render StyleSheet()}
<div style={spacer}></div>
<div style={spacer}></div>
<div style={spacer}></div>
<div style={spacer}></div>
<div style={spacer}></div>
<div id="box" style="{boxCss}; top: 0"></div>
<div id="js-box" style="{boxCss}; top: 100px"></div>
<motion.div id="use-scroll-box" style={{ ...box, top: 200, opacity }} />

{#snippet StyleSheet()}
	<style>
		body {
			margin: 0;
		}
	</style>
{/snippet}
