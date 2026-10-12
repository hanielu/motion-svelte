import type { AsTag, Options } from "#lib/types/index.js";
import type { DOMMotionComponents } from "framer-motion";
import type { Component } from "svelte";

export interface MotionProps<T extends AsTag = "div", K = unknown> extends Omit<
	Options<K>,
	"motionConfig" | "layoutGroup"
> {
	as?: T;
	ref?: HTMLElement | SVGElement | null;
	whileDrag?: Options["whileDrag"];
	whileHover?: Options["whileHover"];
	whilePress?: Options["whilePress"];
	whileInView?: Options["whileInView"];
	whileFocus?: Options["whileFocus"];
	forwardMotionProps?: boolean;
	ignoreStrict?: boolean;
}

export type MotionComponentProps<Props> = {
	[K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
} & MotionProps & {
		ref?: HTMLElement | SVGElement | null;
	};

export type MotionComponent<T extends AsTag = "div", P = unknown> = T extends keyof DOMMotionComponents
	? DOMMotionComponents[T]
	: Component<
			Omit<MotionComponentProps<P>, "children"> & {
				children?: "children" extends keyof P
					? P["children"] | MotionComponentProps<P>["children"]
					: MotionComponentProps<P>["children"];
			}
		>;
