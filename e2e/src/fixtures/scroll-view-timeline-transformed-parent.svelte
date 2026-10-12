<script lang="ts">
	// Repro for #3658: nested motion components inside a useScroll target bind
	// to ScrollTimeline (cover defaults) instead of ViewTimeline.
	import { motion, scroll, useScroll, useTransform } from "motion-sv";

	// ClipReveal, TextReveal and FullRangeProbe are inlined (one instance each).

	// ClipReveal
	let clipRef = $state<HTMLDivElement>();
	const clipScroll = useScroll({
		get target() {
			return clipRef;
		},
		offset: ["start end", "start 0.3"],
	});
	const clipPath = useTransform(
		clipScroll.scrollYProgress,
		[0, 1],
		["inset(8% 12% round 24px)", "inset(0% 0% round 0px)"]
	);
	const scale = useTransform(clipScroll.scrollYProgress, [0, 1], [0.95, 1]);

	// TextReveal
	const text = "Building digital experiences that blur the line between imagination and reality.";
	let ref = $state<HTMLDivElement>();
	let jsRef = $state<HTMLSpanElement>();
	const { scrollYProgress } = useScroll({
		get target() {
			return ref;
		},
		offset: ["start start", "end end"],
	});

	$effect(() => {
		if (!ref) return;
		// 2-arg callback forces the JS scrollInfo path (see attach-function.ts).
		return scroll(
			(_progress, info) => {
				if (jsRef) jsRef.innerText = info.y.progress.toFixed(4);
			},
			{
				target: ref,
				offset: ["start start", "end end"],
			}
		);
	});

	const words = text.split(" ").map((word, i, words) => {
		const start = i / words.length;
		const end = start + 1 / words.length;
		const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
		return { word, opacity };
	});

	// FullRangeProbe
	const probeOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

	const heroStyle = "height: 100vh; display: grid; place-items: center";
</script>

<div style="background: #111; color: #fff; min-height: 100vh">
	<div style={heroStyle}>
		<h1>Scroll down ↓</h1>
	</div>
	<div bind:this={clipRef}>
		<motion.div style={{ clipPath, scale }}>
			<section style="background: #000; min-height: 50vh; padding-top: 40px">
				<div bind:this={ref} style="position: relative; height: 200vh">
					<div
						style="position: sticky; top: 0px; height: 50%; display: flex; align-items: center; flex-direction: column; gap: 16px"
					>
						<div style="font-family: monospace; font-size: 18px">
							js: <span id="js-progress" bind:this={jsRef}>0</span>
						</div>
						<motion.div
							id="opacity-probe"
							style={{
								width: 40,
								height: 40,
								background: "magenta",
								opacity: probeOpacity,
							}}
						/>
						<p style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 32px">
							{#each words as { word, opacity }, i (i)}
								<motion.span style={{ opacity, color: "cyan" }}>{word}</motion.span>
							{/each}
						</p>
					</div>
				</div>
			</section>
		</motion.div>
	</div>
	<div style={heroStyle}>
		<h1>End</h1>
	</div>
</div>
