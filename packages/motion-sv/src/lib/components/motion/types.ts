import type { AsTag, Options } from '@/types/index.js';
import type { DOMMotionComponents } from 'framer-motion';
import type { Component } from 'svelte';

export interface MotionProps<T extends AsTag = 'div', K = unknown>
	extends Omit<Options<K>, 'motionConfig' | 'layoutGroup'> {
	as?: T;
	asChild?: boolean;
	ref?: HTMLElement | SVGElement | null;
	// hover?: Options['hover'];
	// press?: Options['press'];
	// inView?: Options['inView'];
	// focus?: Options['focus'];
	whileDrag?: Options['whileDrag'];
	whileHover?: Options['whileHover'];
	whilePress?: Options['whilePress'];
	whileInView?: Options['whileInView'];
	whileFocus?: Options['whileFocus'];
	forwardMotionProps?: boolean;
	// features?: Feature[]
	ignoreStrict?: boolean;
}

export type MotionComponentProps<Props> = {
	[K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
} & MotionProps & {
		ref?: HTMLElement | SVGElement | null;
	};

export type MotionComponent<T extends AsTag = 'div', P = unknown> = T extends keyof DOMMotionComponents
	? DOMMotionComponents[T]
	: Component<
			Omit<MotionComponentProps<P>, 'children'> & {
				children?: 'children' extends keyof P
					? P['children'] | MotionComponentProps<P>['children']
					: MotionComponentProps<P>['children'];
			}
		>;

// import type { AnyResolvedKeyframe, MotionNodeOptions, MotionValue } from 'motion-dom';
// import type { Properties as CSSProperties } from 'csstype';

// /**
//  * Either a string, or array of strings, that reference variants defined via the `variants` prop.
//  * @public
//  */
// export type VariantLabels = string | string[];

// import type { SVGPathProperties, TransformProperties } from 'motion-dom';
// import type { Snippet } from 'svelte';
// // import type { ComponentKey } from "../components/animate-presence/presence-collector.svelte";
// export type { SVGPathProperties, TransformProperties };

// export type MotionValueString = MotionValue<string>;
// export type MotionValueNumber = MotionValue<number>;
// export type MotionValueAny = MotionValue<any>;
// export type AnyMotionValue = MotionValueNumber | MotionValueString | MotionValueAny;

// type MotionValueHelper<T> = T | AnyMotionValue;
// type MakeMotionHelper<T> = {
// 	[K in keyof T]: MotionValueHelper<T[K]>;
// };

// type MakeCustomValueTypeHelper<T> = MakeMotionHelper<T>;
// export type MakeMotion<T> = MakeCustomValueTypeHelper<T>;

// export type MotionCSS = MakeMotion<Omit<CSSProperties<number, number>, 'rotate' | 'scale' | 'perspective'>>;

// /**
//  * @public
//  */
// export type MotionTransform = MakeMotion<TransformProperties>;

// type MotionCSSVariable = MotionValueNumber | MotionValueString | AnyResolvedKeyframe;

// /**
//  * TODO: Currently unused, would like to reimplement with the ability
//  * to still accept React.CSSProperties.
//  */
// export interface MotionCSSVariables {
// 	[key: `--${string}`]: MotionCSSVariable;
// }

// type MotionSVGProps = MakeMotion<SVGPathProperties>;

// /**
//  * @public
//  */
// export interface MotionStyle extends MotionCSS, MotionTransform, MotionSVGProps {}

// /**
//  * Props for `motion` components.
//  *
//  * @public
//  */
// export interface MotionProps extends MotionNodeOptions {
// 	/**
// 	 *
// 	 * The React DOM `style` prop, enhanced with support for `MotionValue`s and separate `transform` values.
// 	 *
// 	 * ```jsx
// 	 * export const MyComponent = () => {
// 	 *   const x = useMotionValue(0)
// 	 *
// 	 *   return <motion.div style={{ x, opacity: 1, scale: 0.5 }} />
// 	 * }
// 	 * ```
// 	 */
// 	style?: MotionStyle | Record<string, any> | string;

// 	children?: Snippet | MotionValueNumber | MotionValueString;
// 	// key?: ComponentKey;
// }
