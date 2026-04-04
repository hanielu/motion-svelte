import type { TargetAndTransition, VariantLabels } from "motion-dom";

type MarginValue = `${number}${"px" | "%"}`;

type MarginType =
	| MarginValue
	| `${MarginValue} ${MarginValue}`
	| `${MarginValue} ${MarginValue} ${MarginValue}`
	| `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export interface InViewOptions {
	root?: Element | Document;
	margin?: MarginType;
	amount?: "some" | "all" | number;
	/**
	 * Chrome's IntersectionObserver implementation correctly computes intersection
	 * based on the visible/painted area rather than the layout box. This means elements
	 * with CSS properties that make them visually invisible (e.g., `clipPath: inset(0% 100% 0% 0%)`)
	 * will not trigger the `whileInView` animation because Chrome reports `isIntersecting: false`.
	 *
	 * When enabled, this workaround excludes certain CSS properties (like fully-clipping `clipPath`
	 * values) from inline styles until the `whileInView` animation triggers, allowing the
	 * IntersectionObserver to detect the element. The animation will still animate FROM the
	 * initial values because they're stored internally.
	 *
	 * This is opt-in to maintain parity with motion-vue and avoid unexpected behavior changes.
	 *
	 * @see https://github.com/hanielu/motion-svelte/issues/9
	 * @default false
	 */
	useClipPathWorkaround?: boolean;
}

type ViewportEventHandler = (entry: IntersectionObserverEntry | null) => void;

export interface InViewProps {
	inViewOptions?: InViewOptions & { once?: boolean };
	// /**
	//  * @deprecated Use `whileInView` instead.
	//  */
	// inView?: VariantLabels | TargetAndTransition;
	/**
	 * Variant to apply when the element is in view.
	 */
	whileInView?: VariantLabels | TargetAndTransition;
	onViewportEnter?: ViewportEventHandler;
	onViewportLeave?: ViewportEventHandler;
}
