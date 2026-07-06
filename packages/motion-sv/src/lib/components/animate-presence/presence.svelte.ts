import type { AnimatePresenceProps } from "./types.js";
import type { MotionState } from "@/state/motion-state.js";
import { Context } from "runed";
import { motionExit } from "@/animation/transition.svelte.js";

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
