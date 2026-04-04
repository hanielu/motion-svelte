import { createScopedAnimate, type AnimationPlaybackControls } from "framer-motion/dom";

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

	const animate = createScopedAnimate({ scope: domProxy });

	// stop any running animations on unmount
	$effect(() => () => domProxy.animations.forEach((animation) => animation.stop()));

	return [domProxy, animate] as const;
}
