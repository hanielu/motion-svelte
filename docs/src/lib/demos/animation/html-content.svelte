<script lang="ts">
	import { animate, useCurrentMotionValue, useMotionValue, useTransform } from "motion-sv";

	const count = useMotionValue(0);
	const rounded = useTransform(() => Math.round(count.get()));
	const latest = useCurrentMotionValue(rounded);

	$effect(() => {
		const controls = animate(count, 100, { duration: 5 });
		return () => controls.stop();
	});
</script>

<div class="motion-count">{latest.current}</div>

<style>
	.motion-count {
		font-size: 64px;
		color: #4ff0b7;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
