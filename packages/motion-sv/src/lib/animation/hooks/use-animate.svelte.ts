import { createScopedAnimate, type AnimationPlaybackControls } from "framer-motion/dom";
import { prefersReducedMotion } from "svelte/motion";
import { useMotionConfig } from "#lib/components/motion-config/index.js";

type ScopedAnimate = ReturnType<typeof createScopedAnimate>;

/** The element `animate` resolves selectors within (bind it with `bind:this={scope.current}`) and its animations. */
class AnimationScope<T extends Element> {
	current = $state<T>(null!);
	animations: AnimationPlaybackControls[] = [];
}

export function useAnimate<T extends Element = Element>() {
	const scope = new AnimationScope<T>();
	const config = useMotionConfig();

	// Created per call, so imperative animations follow the current MotionConfig, as React's re-created animate does.
	const animate = ((...args: Parameters<ScopedAnimate>) => {
		const { reducedMotion, skipAnimations } = config();
		const reduceMotion =
			reducedMotion === "always" ? true : reducedMotion === "never" ? false : prefersReducedMotion.current;
		return createScopedAnimate({ scope, reduceMotion, skipAnimations })(...args);
	}) as ScopedAnimate;

	// Stop the scope's animations on unmount
	$effect(() => () => {
		scope.animations.forEach((animation) => animation.stop());
		scope.animations.length = 0;
	});

	return [scope, animate] as const;
}
