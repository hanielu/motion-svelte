export type { MotionProps } from './types.js';
import type { MotionComponent } from './types.js';
import { createMotionComponentWithFeatures } from './utils.js';
export { createLayoutMotion } from './layout-motion.svelte';
import { domMax } from '@/features/dom-max.js';

export const motion = createMotionComponentWithFeatures(domMax);
export const Motion = motion.create('div') as unknown as MotionComponent;
