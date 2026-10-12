<script lang="ts">
	import { motion, scroll, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const content = useMotionValue(0.5);

	$effect(() => {
		scroll((p: number) => content.set(p), {
			target: document.querySelector("section") as HTMLElement,
		});
	});

	// motion-sv: a MotionValue can't be passed as children; render its latest value instead.
	const latest = useCurrentMotionValue(content);
</script>

<div style="height: 50vh"></div>
<section style="height: 100vh; display: flex; justify-content: center; align-items: center; color: white">
	<motion.pre id="content">{latest.current}</motion.pre>
</section>
