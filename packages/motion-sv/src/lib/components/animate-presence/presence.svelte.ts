import type { AnimatePresenceProps } from "./types.js";
import type { MotionState } from "#lib/state/motion-state.js";
import { Context } from "#lib/vendor/runed/index.js";
import { motionExit } from "#lib/animation/transition.svelte.js";

export interface PresenceContext {
	initial?: boolean;
	custom?: any;
	presenceId?: string;
	// Notify when a motion component's exit animation is complete
	onMotionExitComplete?: (container: HTMLElement | null, state: MotionState) => void;
	/**
	 * Svelte-specific: the exit transition estimator used by Motion components
	 * to keep the DOM node alive for the duration of the exit animation.
	 */
	transition?: typeof motionExit;
	/**
	 * Svelte-specific: true while the AnimatePresence itself is being destroyed (e.g. its route or parent block went
	 * away). Children then leave without their exit animations, as when an AnimatePresence unmounts in React.
	 */
	isUnmounting?: boolean;
}

export const AnimatePresenceContext = new Context<PresenceContext>("AnimatePresenceContext");

let apId = 0;

export function useAnimatePresence(
	props: AnimatePresenceProps,
	onMotionExitComplete?: PresenceContext["onMotionExitComplete"]
) {
	const presenceContext: PresenceContext = {
		initial: props.initial,
		custom: props.custom,
		presenceId: String(apId++),
		onMotionExitComplete,
		transition: motionExit,
		isUnmounting: false,
	};

	$effect.pre(() => {
		presenceContext.custom = props.custom;
	});

	AnimatePresenceContext.set(presenceContext);

	$effect(() => {
		presenceContext.initial = undefined;
	});

	return presenceContext;
}
