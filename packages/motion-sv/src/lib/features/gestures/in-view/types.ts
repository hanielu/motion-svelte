import type { TargetAndTransition, VariantLabels } from 'motion-dom';

type MarginValue = `${number}${'px' | '%'}`;

type MarginType =
	| MarginValue
	| `${MarginValue} ${MarginValue}`
	| `${MarginValue} ${MarginValue} ${MarginValue}`
	| `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export interface InViewOptions {
	root?: Element | Document;
	margin?: MarginType;
	amount?: 'some' | 'all' | number;
}

type ViewportEventHandler = (entry: IntersectionObserverEntry | null) => void;

export interface InViewProps {
	inViewOptions?: InViewOptions & { once?: boolean };
	/**
	 * @deprecated Use `whileInView` instead.
	 */
	inView?: VariantLabels | TargetAndTransition;
	/**
	 * Variant to apply when the element is in view.
	 */
	whileInView?: VariantLabels | TargetAndTransition;
	onViewportEnter?: ViewportEventHandler;
	onViewportLeave?: ViewportEventHandler;
}
