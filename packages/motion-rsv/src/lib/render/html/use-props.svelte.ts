import { isMotionValue, type AnyResolvedKeyframe, type MotionValue } from 'motion-dom';
import type { MotionProps } from '../../motion/types.js';
import { isForcedMotionValue } from '../../motion/utils/is-forced-motion-value.js';
import type { ResolvedValues } from '../types.js';
import { buildHTMLStyles } from './utils/build-styles.js';
import { createHtmlRenderState } from './utils/create-render-state.js';
import { read, type ReadableBox } from 'runed';
import type { HTMLAttributes } from 'svelte/elements';
import { toStyleString } from './utils/style-string.js';

export function copyRawValuesOnly(
	target: ResolvedValues,
	source: { [key: string]: AnyResolvedKeyframe | MotionValue },
	props: MotionProps
) {
	for (const key in source) {
		if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
			target[key] = source[key] as AnyResolvedKeyframe;
		}
	}
}

function useInitialMotionValues({ transformTemplate }: MotionProps, visualState: ResolvedValues) {
	const state = createHtmlRenderState();

	buildHTMLStyles(state, visualState, transformTemplate);

	return Object.assign({}, state.vars, state.style);
}

function useStyle(props: MotionProps, visualState: ResolvedValues): ResolvedValues {
	const styleProp = props.style || {};
	const style = {};

	/**
	 * Copy non-Motion Values straight into style
	 */
	if (styleProp && typeof styleProp === 'object') {
		copyRawValuesOnly(style, styleProp as any, props);
	}

	Object.assign(style, useInitialMotionValues(props, visualState));

	return style;
}

export function useHTMLProps(
	props: ReadableBox<MotionProps & HTMLAttributes<HTMLElement>>,
	visualState: ReadableBox<ResolvedValues>
) {
	const htmlProps = $derived.by(() => {
		// The `any` isn't ideal but it is the type of createElement props argument
		const htmlProps: any = {};
		const style = useStyle(props.current, visualState.current);

		if (props.current.drag && props.current.dragListener !== false) {
			// Disable the ghost element when a user drags
			htmlProps.draggable = false;

			// Disable text selection
			style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = 'none';

			// Disable scrolling on the draggable direction
			style.touchAction = props.current.drag === true ? 'none' : `pan-${props.current.drag === 'x' ? 'y' : 'x'}`;
		}

		if (
			props.current.tabindex === undefined &&
			(props.current.onTap || props.current.onTapStart || props.current.whileTap)
		) {
			htmlProps.tabIndex = 0;
		}

		const baseStyleString = typeof props.current.style === 'string' ? (props.current.style as string) : '';
		const computedStyleString = toStyleString(style);
		htmlProps.style = baseStyleString
			? baseStyleString.replace(/;\s*$/u, '') + ';' + computedStyleString
			: computedStyleString;

		return htmlProps;
	});

	return read(() => htmlProps);
}
