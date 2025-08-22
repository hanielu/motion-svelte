import type { AnimationScope } from "motion-dom";
import { createScopedAnimate } from "../animate/index.js";
import { onMount } from "svelte";

export function useAnimate<T extends Element = any>() {
  const scope: AnimationScope<T> = {
    current: null!, // Will be hydrated on mount by svelte
    animations: [],
  };

  let animate: ReturnType<typeof createScopedAnimate> = null!;

  onMount(() => {
    animate = createScopedAnimate(scope);

    return () => {
      scope.animations.forEach(animation => animation.stop());
      scope.animations.length = 0;
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
    animate: ReturnType<typeof createScopedAnimate>;
  };
}
