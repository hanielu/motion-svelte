import { onMount } from "svelte";
import { createScopedWaapiAnimate } from "../animators/waapi/animate-style.js";
import type { AnimationScope } from "motion-dom";

export function useAnimateMini<T extends Element = any>() {
	const scope: AnimationScope<T> = {
		current: null!, // Will be hydrated on mount by svelte
		animations: [],
	};

	let animate: ReturnType<typeof createScopedWaapiAnimate> = null!;

	onMount(() => {
		animate = createScopedWaapiAnimate(scope);

		return () => {
			scope.animations.forEach((animation) => animation.stop());
		};
	});

	return {
		set scope(v) {
			// @ts-expect-error - we want to set the current property
			scope.current = v;
		},
		get scope() {
			return scope.current;
		},
		get animate() {
			return animate;
		},
	} as {
		scope: T;
		/**
		 * This method is only available after the component is mounted.
		 *
		 * @warning DO NOT DESTRUCTURE THIS OBJECT.
		 */
		readonly animate: ReturnType<typeof createScopedWaapiAnimate>;
	};
}

const { scope, animate } = useAnimateMini();
console.log(scope, animate);
