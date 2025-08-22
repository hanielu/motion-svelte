import { createScopedAnimate, type AnimationScope } from "framer-motion/dom";

export function useAnimate<T extends Element = Element>() {
	const scope: AnimationScope<T> = {
		current: null!, // Will be hydrated on mount by svelte
		animations: [],
	};

	const animate = createScopedAnimate(scope);

	// stop any running animations on unmount
	$effect(() => {
		return () => {
			for (const a of scope.animations) a.stop();
			scope.animations.length = 0;
		};
	});

	return [scope, animate] as const;
}
