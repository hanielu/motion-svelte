<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	// DefaultTarget, EnterTarget and StringOffsetTarget are inlined (one instance each).

	/**
	 * Default offset (All preset / contain range)
	 */
	let defaultRef = $state<HTMLDivElement>();
	const defaultScroll = useScroll({
		get target() {
			return defaultRef;
		},
	});
	const defaultOpacity = useTransform(defaultScroll.scrollYProgress, [0, 1], [1, 0]);

	/**
	 * Enter preset offset — [[0,1],[1,1]]
	 */
	let enterRef = $state<HTMLDivElement>();
	const enterScroll = useScroll({
		get target() {
			return enterRef;
		},
		offset: [
			[0, 1],
			[1, 1],
		],
	});
	const enterOpacity = useTransform(enterScroll.scrollYProgress, [0, 1], [0, 1]);

	/**
	 * String offset — should NOT accelerate
	 */
	let stringRef = $state<HTMLDivElement>();
	const stringScroll = useScroll({
		get target() {
			return stringRef;
		},
		offset: ["start end", "end start"],
	});
	const stringOpacity = useTransform(stringScroll.scrollYProgress, [0, 1], [1, 0]);

	const spacer = "height: 100vh";
	const targetStyle = "height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column";
	const box = {
		width: 100,
		height: 100,
		background: "red",
	};
</script>

<div style={spacer}></div>
<div bind:this={defaultRef} style={targetStyle}>
	<motion.div id="default-target" style={{ ...box, opacity: defaultOpacity }} />
	<span id="default-accelerate">{defaultScroll.scrollYProgress.accelerate ? "true" : "false"}</span>
</div>
<div style={spacer}></div>
<div bind:this={enterRef} style={targetStyle}>
	<motion.div id="enter-target" style={{ ...box, opacity: enterOpacity }} />
	<span id="enter-accelerate">{enterScroll.scrollYProgress.accelerate ? "true" : "false"}</span>
</div>
<div style={spacer}></div>
<div bind:this={stringRef} style={targetStyle}>
	<motion.div id="string-target" style={{ ...box, opacity: stringOpacity }} />
	<span id="string-accelerate">{stringScroll.scrollYProgress.accelerate ? "true" : "false"}</span>
</div>
<div style={spacer}></div>
