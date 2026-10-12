<script lang="ts">
	import { motion } from "motion-sv";

	const params = new URLSearchParams(window.location.search);
	const amount = (params.get("amount") || undefined) as "some" | "all" | undefined;
	const once = params.get("once") ? true : undefined;
	const margin = (params.get("margin") || undefined) as `${number}px` | undefined;
	const deleteObserver = params.get("delete") || undefined;
	// motion-sv: inViewOptions has no `fallback` option, so upstream's `disableFallback` param
	// (`viewport.fallback: !disableFallback`) is not ported.
	let inViewport = $state(false);

	if (deleteObserver) {
		(window as any).IntersectionObserver = undefined;
	}
</script>

<div style="padding-top: 700px">
	<motion.div
		id="box"
		initial={false}
		transition={{ duration: 0.01 }}
		animate={{ background: "rgba(255,0,0,1)" }}
		whileInView={{ background: "rgba(0,255,0,1)" }}
		inViewOptions={{ amount, once, margin }}
		style={{ width: 100, height: 100 }}
		onViewportEnter={() => (inViewport = true)}
		onViewportLeave={() => (inViewport = false)}
	>
		{inViewport ? "In" : "Out"}
	</motion.div>
</div>
