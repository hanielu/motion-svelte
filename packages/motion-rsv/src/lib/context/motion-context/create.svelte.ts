import { box, type ReadableBox } from 'runed';
import type { MotionProps } from '../../motion/types.js';
import { type MotionContextProps, MotionContext } from './index.js';
import { getCurrentTreeVariants } from './utils.js';

export function useCreateMotionContext<Instance>(props: ReadableBox<MotionProps>): MotionContextProps<Instance> {
	const { initial, animate } = $derived(getCurrentTreeVariants(props.current, MotionContext.getOr()));

	return {
		get initial() {
			return initial;
		},
		get animate() {
			return animate;
		},
	};
}
