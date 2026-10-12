import type { AnimatePresenceProps } from "./types.js";
import { createOptionalContext } from "#lib/utils/optional-context.js";

export interface PresenceContext {
	readonly initial?: boolean;
	readonly custom?: unknown;
	/**
	 * Svelte-specific: true while the AnimatePresence itself is being destroyed (e.g. its route or parent block went
	 * away). Children then leave without their exit animations, as when an AnimatePresence unmounts in React.
	 */
	isUnmounting: boolean;
}

export const [getPresenceContext, setPresenceContext] = createOptionalContext<PresenceContext>();

/** Provide the presence context; `props` are getters, so children always read the current values. */
export function useAnimatePresence(props: Pick<AnimatePresenceProps, "initial" | "custom">) {
	// `initial={false}` only applies to the children rendered with AnimatePresence itself, which have all mounted by
	// the time its effects run.
	let hasMounted = false;
	$effect(() => {
		hasMounted = true;
	});

	return setPresenceContext({
		get initial() {
			return hasMounted ? undefined : props.initial;
		},
		get custom() {
			return props.custom;
		},
		isUnmounting: false,
	});
}
