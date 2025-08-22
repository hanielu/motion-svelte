import type { Feature } from '@/features/index.js';
import { Context, type Ref } from 'runed';

export type LazyMotionContext = {
	features: Ref<Feature[]>;
	strict: boolean;
};

export const LazyMotionContext = new Context<LazyMotionContext>('LazyMotionContext');
