import { animateValue, frame, frameData, isMotionValue, motionValue } from 'framer-motion/dom';
import type { JSAnimation, MotionValue } from 'framer-motion/dom';
import type { AnyResolvedKeyframe, SpringOptions } from 'framer-motion';
import { watch, extract, type MaybeGetter } from 'runed';

function toNumber(v: string | number) {
	if (typeof v === 'number') return v;
	return parseFloat(v);
}

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
export function useSpring(source: MotionValue<string>, config?: MaybeGetter<SpringOptions>): MotionValue<string>;
export function useSpring(source: string, config?: MaybeGetter<SpringOptions>): MotionValue<string>;
export function useSpring(source: MotionValue<number>, config?: MaybeGetter<SpringOptions>): MotionValue<number>;
export function useSpring(source: number, config?: MaybeGetter<SpringOptions>): MotionValue<number>;
export function useSpring(
	source: MotionValue<string> | MotionValue<number> | AnyResolvedKeyframe,
	config: MaybeGetter<SpringOptions> = {}
): MotionValue<any> {
	let activeSpringAnimation: JSAnimation<number | string> | null = null;
	const sourceValue = isMotionValue(source) ? toNumber(source.get()) : (source as string | number);
	const value = motionValue(sourceValue);
	let latestValue: number | string = sourceValue;
	let latestSetter = () => {};

	const stopAnimation = () => {
		if (activeSpringAnimation) {
			activeSpringAnimation.stop();
			activeSpringAnimation = null;
		}
	};

	const startAnimation = () => {
		const animation = activeSpringAnimation;

		if (animation?.time === 0) {
			animation.sample(frameData.delta);
		}

		stopAnimation();
		const springConfig = extract(config);
		activeSpringAnimation = animateValue({
			keyframes: [value.get(), latestValue],
			velocity: value.getVelocity(),
			type: 'spring',
			restDelta: 0.001,
			restSpeed: 0.01,
			...springConfig,
			onUpdate: latestSetter,
		});
	};

	watch(
		() => extract(config),
		() => {
			(value as any).attach((v: any, set: any) => {
				latestValue = toNumber(v);
				latestSetter = set;
				frame.update(startAnimation);
				return value.get();
			}, stopAnimation);
		}
	);

	if (isMotionValue(source)) {
		source.on('change', (v) => {
			value.set(toNumber(v));
		});
	}

	return value;
}
