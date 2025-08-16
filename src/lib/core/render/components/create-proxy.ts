import { warnOnce } from "motion-utils";
import { createMotionComponent, type MotionComponentOptions } from "../../motion/motion.svelte";
import type { FeaturePackages } from "../../motion/features/types.js";
import type { MotionProps } from "../../motion/types.js";
import type { DOMMotionComponents } from "../dom/types.js";
import type { CreateVisualElement } from "../types.js";

/**
 * I'd rather the return type of `custom` to be implicit but this throws
 * incorrect relative paths in the exported types and API Extractor throws
 * a wobbly.
 */
// type ComponentProps<Props> = React.PropsWithoutRef<Props & MotionProps> &
//     React.RefAttributes<SVGElement | HTMLElement>
// export type CustomDomComponent<Props> = React.ComponentType<
//     ComponentProps<Props>
// >

type MotionProxy = typeof createMotionComponent &
  DOMMotionComponents & { create: typeof createMotionComponent };

export function createMotionProxy(
  preloadedFeatures: FeaturePackages,
  createDomVisualElement: CreateVisualElement
) {
  if (typeof Proxy === "undefined") {
    // Only modern API: consumer must call motion.create("div")
    return Object.assign(function () {}, {
      create: createMotionComponent,
    }) as unknown as MotionProxy;
  }

  const componentCache = new Map<string, any>();

  const factory = (Component: string, options?: MotionComponentOptions) =>
    createMotionComponent(Component, options, preloadedFeatures, createDomVisualElement);

  return new Proxy(factory, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key: string) => {
      if (key === "create") return factory;
      if (!componentCache.has(key)) {
        componentCache.set(
          key,
          createMotionComponent(key, undefined, preloadedFeatures, createDomVisualElement)
        );
      }
      return componentCache.get(key)!;
    },
  }) as MotionProxy;
}
