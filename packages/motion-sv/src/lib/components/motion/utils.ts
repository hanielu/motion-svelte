import type { Component, ComponentProps } from "svelte";
import Motion from "./motion.svelte";
import type { FeatureBundle } from "#lib/features/dom-animation.js";
import type { createVisualElement } from "#lib/state/create-visual-element.js";
import { updateLazyFeatures } from "#lib/features/lazy-features.js";
import type { MotionComponent, MotionProps } from "./types.js";
import type { SvelteHTMLElements } from "svelte/elements";
import type { MotionHTMLAttributes } from "#lib/types/motion-values.js";
import type { ElementType } from "#lib/types/index.js";
import { withProp } from "#lib/vendor/runed/index.js";

export interface MotionCreateOptions {
	forwardMotionProps?: boolean;
	renderer?: typeof createVisualElement;
}

const componentMaxCache = new Map<any, Component>();
const componentMiniCache = new Map<any, Component>();

export function createMotionComponent(component: string | Component, options: MotionCreateOptions = {}) {
	const isString = typeof component === "string";
	const name = isString ? component : component.name || "";
	const componentCache = options.renderer ? componentMaxCache : componentMiniCache;
	if (isString && componentCache?.has(component)) {
		return componentCache.get(component);
	}

	const motionComponent: MotionComponent<typeof component> = (anchor, props) => {
		const getAs = () => props.as || component || "div";
		return Motion(anchor, {
			renderer: options.renderer,
			get forwardMotionProps() {
				return props.forwardMotionProps || options.forwardMotionProps;
			},
			get as() {
				return getAs();
			},
			get props() {
				return withProp(props, "as", getAs());
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
		Omit<MotionProps<K, unknown>, "as" | "asChild" | "motionConfig" | "layoutGroup"> & MotionHTMLAttributes<K>
	>;
} & {
	// Component overload
	create<T extends Component>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, "as" | "asChild"> & ComponentProps<T>>;

	// ElementType overload
	create<T extends ElementType>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, "asChild"> & MotionHTMLAttributes<T>>;
};

export function createMotionComponentWithFeatures(featureBundle?: FeatureBundle) {
	const renderer = featureBundle?.renderer;
	updateLazyFeatures(featureBundle?.features || []);
	return new Proxy({} as unknown as MotionNameSpace, {
		get(_target, key) {
			if (key === "create") {
				return (component: any, options?: MotionCreateOptions) =>
					createMotionComponent(component, {
						...options,
						renderer,
					});
			}

			return createMotionComponent(key as string, {
				renderer,
			});
		},
	});
}
