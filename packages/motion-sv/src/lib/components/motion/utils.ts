import type { Component, ComponentProps } from 'svelte';
import Motion from './motion.svelte';
import type { Feature } from '@/features/index.js';
import type { MotionComponent, MotionProps } from './types.js';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { MotionHTMLAttributes } from '@/types/motion-values.js';
import type { ElementType } from '@/types/index.js';

export interface MotionCreateOptions {
	forwardMotionProps?: boolean;
	features?: Feature[];
}

const componentMaxCache = new Map<any, Component>();
const componentMiniCache = new Map<any, Component>();

export function createMotionComponent(component: string | Component, options: MotionCreateOptions = {}) {
	const isString = typeof component === 'string';
	const name = isString ? component : component.name || '';
	const componentCache = options.features?.length! > 0 ? componentMaxCache : componentMiniCache;
	if (isString && componentCache?.has(component)) {
		return componentCache.get(component);
	}

	const motionComponent: MotionComponent<typeof component> = (anchor, props) => {
		return Motion(anchor, {
			features: options.features,
			get forwardMotionProps() {
				return props.forwardMotionProps || options.forwardMotionProps;
			},
			get as() {
				return props.as || component || 'div';
			},
			get props() {
				return props;
			},
			get ref() {
				return props.ref!;
			},
			set ref(value) {
				props.ref = value;
			},
		});
	};

	if (isString) {
		componentCache?.set(component, motionComponent);
	}

	return motionComponent;
}

export type MotionNameSpace = {
	[K in keyof SvelteHTMLElements]: Component<
		Omit<MotionProps<K, unknown>, 'as' | 'asChild' | 'motionConfig' | 'layoutGroup'> & MotionHTMLAttributes<K>
	>;
} & {
	// Component overload
	create<T extends Component>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, 'as' | 'asChild'> & ComponentProps<T>>;

	// ElementType overload
	create<T extends ElementType>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, 'as' | 'asChild'> & MotionHTMLAttributes<T>>;
};

export function createMotionComponentWithFeatures(features: Feature[] = []) {
	return new Proxy({} as unknown as MotionNameSpace, {
		get(_target, key) {
			if (key === 'create') {
				return (component: any, options?: MotionCreateOptions) =>
					createMotionComponent(component, {
						...options,
						features,
					});
			}

			return createMotionComponent(key as string, {
				features,
			});
		},
	});
}
