<script lang="ts">
	import { AsyncMotionValueAnimation, motionValue } from "motion-sv";
	import { onMount } from "svelte";

	interface ExtendedMotionValue {
		owner: { current: HTMLDivElement | undefined; getProps: () => unknown };
	}

	interface ExtendedAnimation extends AsyncMotionValueAnimation<number> {
		_resolved: boolean;
	}

	let ref = $state<HTMLDivElement>();

	onMount(() => {
		if (!ref) return;
		const opacity = motionValue(0);
		const extendedOpacity = opacity as unknown as ExtendedMotionValue;
		extendedOpacity.owner = { current: ref, getProps: () => ({}) };

		const animation = new AsyncMotionValueAnimation({
			keyframes: [0, 1],
			motionValue: opacity,
			name: "opacity",
		});

		animation.stop();

		// If this animation resolved, that is incorrect
		const extendedAnimation = animation as unknown as ExtendedAnimation;
		if (extendedAnimation._resolved) {
			ref.textContent = "Error";
		}

		new AsyncMotionValueAnimation({
			keyframes: [0.4, 0.5],
			motionValue: opacity,
			name: "opacity",
		});

		// Animation shouldn't fail if element is removed before keyframes resolve
		extendedOpacity.owner.current = undefined;
	});
</script>

<section style="position: relative; display: flex; flex-direction: column; padding: 100px">
	<div
		bind:this={ref}
		id="box"
		style="width: 100px; height: 100px; position: relative; top: 100px; left: 100px; background-color: red; opacity: 1"
	>
		Content
	</div>
</section>
