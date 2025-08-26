import { animationControls } from "@/animation/hooks/animation-controls.js";

/**
 * Creates `AnimationControls`, which can be used to manually start, stop
 * and sequence animations on one or more components.
 *
 * The returned `AnimationControls` should be passed to the `animate` property
 * of the components you want to animate.
 *
 * These components can then be animated with the `start` method.
 *
 * ```svelte
 * <script>
 * 	import { motion, useAnimationControls } from 'motion-sv'
 * 	const controls = useAnimationControls()
 *
 * 	controls.start({
 * 		x: 100,
 * 		transition: { duration: 0.5 },
 * 	})
 * </script>
 *
 * <motion.div animate={controls} />
 * ```
 *
 * @returns Animation controller with `start`, `stop`, `set` and `mount` methods
 *
 * @public
 */
export function useAnimationControls() {
	const controls = animationControls();
	$effect(() => {
		return controls.mount();
	});
	return controls;
}
