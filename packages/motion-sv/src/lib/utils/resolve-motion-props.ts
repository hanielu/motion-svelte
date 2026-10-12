import type { LayoutGroupState } from "#lib/components/context.js";
import type { PresenceContext } from "#lib/components/animate-presence/presence.svelte.js";
import type { MotionConfigState } from "#lib/components/motion-config/types.js";
import type { Options } from "#lib/types/index.js";

export interface MotionContext {
	layoutGroup: LayoutGroupState;
	presenceContext: PresenceContext | undefined;
	config: MotionConfigState;
}

/**
 * Merge motion props with context values (layout group, presence, config).
 */
export function resolveMotionProps(
	props: Options,
	context: MotionContext
): Options & { presenceContext: PresenceContext | undefined } {
	const { layoutGroup, presenceContext, config } = context;

	const layoutId =
		layoutGroup.id && props.layoutId ? `${layoutGroup.id}-${props.layoutId}` : props.layoutId || undefined;

	return {
		...props,
		layoutId,
		transition: props.transition ?? config.transition,
		layoutGroup,
		motionConfig: config,
		inViewOptions: props.inViewOptions ?? config.inViewOptions,
		presenceContext,
		initial: presenceContext?.initial === false ? false : props.initial === true ? undefined : props.initial,
	};
}
