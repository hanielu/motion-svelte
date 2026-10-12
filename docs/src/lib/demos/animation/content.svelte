<script lang="ts">
	import { animate, useCurrentMotionValue, useMotionValue } from "motion-sv";

	const count = useMotionValue(0);
	const latest = useCurrentMotionValue(count);

	$effect(() => {
		const controls = animate(count, 100, { duration: 5 });
		return () => controls.stop();
	});
</script>

<pre>{Math.round(latest.current)}</pre>

<style>
	pre {
		margin: 0;
		color: #ff0088;
		font-size: 4rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
</style>
