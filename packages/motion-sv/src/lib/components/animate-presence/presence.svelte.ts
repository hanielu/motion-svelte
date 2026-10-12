import type { AnimatePresenceProps } from "./types.js";
import { Context } from "#lib/vendor/runed/index.js";

export interface PresenceContext {
	initial?: boolean;
	custom?: any;
	presenceId?: string;
	/**
	 * Svelte-specific: true while the AnimatePresence itself is being destroyed (e.g. its route or parent block went
	 * away). Children then leave without their exit animations, as when an AnimatePresence unmounts in React.
	 */
	isUnmounting?: boolean;
}

export const AnimatePresenceContext = new Context<PresenceContext>("AnimatePresenceContext");

let apId = 0;

export function useAnimatePresence(props: AnimatePresenceProps) {
	let hasMounted = false;
	// `initial` and `custom` are getters, so children always read the current values.
	const presenceContext: PresenceContext = {
		get initial() {
			return hasMounted ? undefined : props.initial;
		},
		get custom() {
			return props.custom;
		},
		presenceId: String(apId++),
		isUnmounting: false,
	};

	AnimatePresenceContext.set(presenceContext);

	$effect(() => {
		hasMounted = true;
	});

	return presenceContext;
}
