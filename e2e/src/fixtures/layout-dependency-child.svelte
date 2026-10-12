<script lang="ts">
	import { AnimatePresence, createLayoutMotion, motion, type Variants } from "motion-sv";

	let divState = $state(false);
	let animating = $state(false);
	let transitionId = $state(0);

	const layout = createLayoutMotion();

	const duration = 10;
	const commonVariant = {
		position: "absolute",
		boxSizing: "border-box",
		left: 25,
		width: 100,
		height: 25,
		backgroundColor: "blue",
	} as const;

	const variants: Variants = {
		visible: {
			opacity: 1,
			...commonVariant,
		},
		hidden: {
			opacity: 0,
			...commonVariant,
		},
	};

	// Upstream spreads {...deps}; motion-sv throws on mount when props are spread onto a motion component
	// ("'set' on proxy: trap returned falsish for property 'ref'"), so the prop is passed explicitly.
	const layoutDependency = $derived(animating ? transitionId : -1);

	const animate = layout.update.with(() => {
		divState = !divState;
		transitionId = transitionId + 1;
		animating = true;
	});
</script>

<layout.div
	{layoutDependency}
	onAnimationComplete={() => (animating = false)}
	class={divState ? "outerAnimate" : "outer"}
	transition={{ duration, ease: () => 0.5 }}
>
	<AnimatePresence>
		{#if !divState}
			<motion.div
				layout
				id="child"
				{layoutDependency}
				{variants}
				animate="visible"
				exit="hidden"
				initial="hidden"
				transition={{
					duration,
					ease: () => 0.5,
					repeatDelay: 0.001,
				}}
			/>
		{/if}
	</AnimatePresence>
</layout.div>

<button style="position: absolute; right: 10px; top: 10px" onclick={animate}>Animate</button>

<style>
	:global(.outer) {
		width: 200px;
		height: 100px;
		top: 10px;
		left: 10px;
		position: absolute;
		background-color: red;
		overflow: visible;
	}

	:global(.outerAnimate) {
		/* Height and width are the only things that's changing */
		width: 100px;
		height: 75px;
		top: 10px;
		left: 10px;
		position: absolute;
		background-color: red;
		overflow: visible;
	}

	:global(.border) {
		/* Border div has inset: 0 so should follow the size of its parent (outer/outerAnimate) */
		inset: 0;
		position: absolute;
		box-sizing: border-box;
	}
</style>
