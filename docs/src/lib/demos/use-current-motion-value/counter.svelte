<script lang="ts">
	import { animate, useCurrentMotionValue, useMotionValue, useTransform } from "motion-sv";

	const count = useMotionValue(0);
	const rounded = useTransform(() => Math.round(count.get()));
	const display = useCurrentMotionValue(rounded);

	$effect(() => {
		const controls = animate(count, 100, { duration: 2 });
		return () => controls.stop();
	});
</script>

<output>{display.current}</output>

<style>
	output {
		color: #ff0088;
		font-size: 64px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
</style>
