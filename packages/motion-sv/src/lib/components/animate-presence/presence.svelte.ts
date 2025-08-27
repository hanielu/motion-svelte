import type { AnimatePresenceProps } from "./types.js";
import { Context } from "runed";
import { motionExit } from "@/animation/transition.svelte.js";

export const doneCallbacks = new WeakMap<Element, (v?: any, safeUnmount?: boolean) => void>();

export function removeDoneCallback(element: Element) {
	const prevDoneCallback = doneCallbacks.get(element);
	if (prevDoneCallback) {
		element.removeEventListener("motioncomplete", prevDoneCallback);
	}
	doneCallbacks.delete(element);
}

export interface PresenceContext {
	initial?: boolean;
	custom?: any;
	transition?: typeof motionExit;
}

export const AnimatePresenceContext = new Context<PresenceContext>("AnimatePresenceContext");

export function useAnimatePresence(props: AnimatePresenceProps) {
	const presenceContext = {
		initial: props.initial,
		custom: props.custom,
		transition: motionExit,
	};

	$effect.pre(() => {
		presenceContext.custom = props.custom;
	});

	AnimatePresenceContext.set(presenceContext);

	$effect(() => {
		presenceContext.initial = undefined;
	});
}
