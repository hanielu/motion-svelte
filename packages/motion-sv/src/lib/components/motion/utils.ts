import type { Component, ComponentProps } from "svelte";
import Motion from "./motion.svelte";
import type { FeatureBundle } from "#lib/features/dom-animation.js";
import type { MotionComponent, MotionProps } from "./types.js";
import type { SvelteHTMLElements } from "svelte/elements";
import type { MotionHTMLAttributes } from "#lib/types/motion-values.js";
import type { ElementType } from "#lib/types/index.js";
import { withProp } from "#lib/vendor/runed/index.js";

export interface MotionCreateOptions {
	forwardMotionProps?: boolean;
}

// Tag components, per feature bundle (`undefined` for `m`)
const componentCaches = new Map<FeatureBundle | undefined, Map<string, Component>>();

export function createMotionComponent(
	component: string | Component,
	options: MotionCreateOptions = {},
	bundle?: FeatureBundle
) {
	const isString = typeof component === "string";
	let componentCache = componentCaches.get(bundle);
	if (!componentCache) componentCaches.set(bundle, (componentCache = new Map()));
	if (isString && componentCache.has(component)) {
		return componentCache.get(component);
	}

	const motionComponent: MotionComponent<typeof component> = (anchor, props) => {
		const getAs = () => props.as || component || "div";
		return Motion(anchor, {
			bundle,
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
				// Only a bound `ref` accepts the element. Reflect.set skips an unbound one (e.g. spread props) instead
				// of throwing.
				Reflect.set(props, "ref", value);
			},
		});
	};

	if (isString) {
		componentCache?.set(component, motionComponent);
	}

	return motionComponent;
}

/** Renders another element than the component's own, e.g. when the tag is chosen at runtime. */
export interface AsProp {
	as?: ElementType;
}

export type MotionNameSpace = {
	[K in keyof SvelteHTMLElements]: Component<
		Omit<MotionProps<K, unknown>, "as" | "motionConfig" | "layoutGroup"> & MotionHTMLAttributes<K> & AsProp
	>;
} & {
	// Component overload
	create<T extends Component>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, "as"> & ComponentProps<T>>;

	// ElementType overload
	create<T extends ElementType>(
		component: T,
		options?: MotionCreateOptions
	): Component<Omit<MotionProps<T, unknown>, "as"> & MotionHTMLAttributes<T> & AsProp>;
};

export function createMotionComponentWithFeatures(featureBundle?: FeatureBundle) {
	return new Proxy({} as unknown as MotionNameSpace, {
		get(_target, key) {
			if (key === "create") {
				return (component: string | Component, options?: MotionCreateOptions) =>
					createMotionComponent(component, options, featureBundle);
			}

			return createMotionComponent(key as string, {}, featureBundle);
		},
	});
}
