import { createScopedAnimate, type AnimationPlaybackControls } from "framer-motion/dom";
import type { AnimationScope } from "motion-dom";
import { useMotionConfig } from "@/components/motion-config/index.js";

type Scope = { current: Element; animations: AnimationPlaybackControls[] };

export function useAnimate<T extends Element = any>(): [Scope, ReturnType<typeof createScopedAnimate>] {
	let domNode = $state<{ current: T | null }>({ current: null });

	const domProxy = new Proxy(domNode, {
		get(target, key) {
			if (typeof key === "string" || typeof key === "symbol") {
				if (key === "current") return Reflect.get(target, "current");
				return Reflect.get(target, key);
			}
			return undefined;
		},
		set(target, key, value) {
			if (key === "current") return Reflect.set(target, key, value);
			if (key === "animations") return Reflect.set(target, key, value);
			return true;
		},
	}) as unknown as Scope;

	domProxy.animations = [];

	const config = useMotionConfig();

	// Recreate the scoped animate whenever `skipAnimations` changes so imperative
	// animations respect `<MotionConfig skipAnimations>`, mirroring React's useAnimate.
	const scopedAnimate = $derived(
		createScopedAnimate({
			scope: domProxy as unknown as AnimationScope<T>,
			skipAnimations: config().skipAnimations,
		})
	);

	// Stable wrapper so callers keep a single reference while always delegating to
	// the latest config-aware scoped animate.
	const animate = ((...args: Parameters<ReturnType<typeof createScopedAnimate>>) =>
		scopedAnimate(...args)) as ReturnType<typeof createScopedAnimate>;

	// stop any running animations on unmount
	$effect(() => () => domProxy.animations.forEach((animation) => animation.stop()));

	return [domProxy, animate] as const;
}
