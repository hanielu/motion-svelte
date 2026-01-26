<script lang="ts">
	import { useAnimatePresence } from "./presence.svelte.js";
	import type { AnimatePresenceProps } from "./types.js";
	import { usePopLayout } from "./use-pop-layout.js";
	import type { Snippet } from "svelte";
	import { PresenceManagerContext } from "./index.js";
	import { mountedStates } from "@/state/motion-state.js";
	import { removeDoneCallback } from "./presence.svelte.js";
	import { delay } from "@/utils/delay.js";

	let {
		mode = "sync",
		initial = true,
		anchorX = "left",
		as,
		custom,
		onExitComplete,
		children,
	}: AnimatePresenceProps & { children: Snippet } = $props();

	// TODO: (haniel) maybe these don't need to be getters?
	useAnimatePresence({
		mode,
		initial,
		get custom() {
			return custom;
		},
		get anchorX() {
			return anchorX;
		},
	});

	const { addPopStyle, removePopStyle, trackPosition, untrackPosition, styles } = usePopLayout({
		get mode() {
			return mode;
		},
		get anchorX() {
			return anchorX;
		},
	});

	/**
	 * Track elements that are actively exiting.
	 * Key: The DOM element exiting.
	 * Value: { blocksExit: boolean } - whether this exit should block "wait" mode.
	 *
	 * This prevents double-handling of exit events and allows tracking specific element status.
	 */
	const exitDom = new Map<Element, { blocksExit: boolean }>();

	/**
	 * Track elements that are actively exiting AND blocking (have actual exit animations).
	 *
	 * This is crucial for `mode="wait"`. When this count is > 0, `isWaitBlocked` becomes true.
	 * Child `motion` components subscribe to this state via `PresenceManagerContext`.
	 *
	 * In `motion.svelte`, if `isWaitBlocked` is true:
	 * 1. The entering component is hidden (`display: none`) and its animation is paused.
	 * 2. When the count drops to 0, the component unhides and starts its "animate" state.
	 */
	let blockingExitCount = $state(0);

	// Subscribers to be notified when a blocking exit starts
	const exitStartSubscribers = new Set<(exitingEl: Element) => void>();
	function subscribeToExitStart(callback: (exitingEl: Element) => void): () => void {
		exitStartSubscribers.add(callback);
		return () => exitStartSubscribers.delete(callback);
	}
	const notifyExitStart = (exitingEl: Element) => exitStartSubscribers.forEach((cb) => cb(exitingEl));

	$effect.pre(() => () => {
		exitDom.clear();
		blockingExitCount = 0;
		exitStartSubscribers.clear();
	});

	const isWaitBlocked = () => mode === "wait" && blockingExitCount > 0;

	function handleIntroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;

		// Clean up exit state if this element was exiting
		const entry = exitDom.get(el);
		if (entry) {
			exitDom.delete(el);
			if (entry.blocksExit && blockingExitCount > 0) {
				blockingExitCount--;
			}
		}

		removePopStyle(state);
		// Re-track position for popLayout mode since element is re-entering
		trackPosition(state);

		removeDoneCallback(el);
		// Reset exit without animating
		state.setActive("exit", false, false);
		// Resume enter animation from current values
		state.startAnimation();
	}

	function handleOutroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		if (exitDom.has(el)) return;

		addPopStyle(state);

		// Only elements with an actual exit animation should block.
		// Elements with only layoutId (no exit) should run their layout animation
		// in parallel without blocking other animations.
		const blocksExit = !!state.options.exit;

		exitDom.set(el, { blocksExit });

		// Only increment the blocking counter for elements that should block
		if (blocksExit) {
			blockingExitCount++;
			// Notify layout-only elements to start their animations in parallel
			notifyExitStart(el);
		}

		// Defer to next microtask to ensure updated layout/values
		delay(() => {
			state.setActive?.("exit", true);
		});
	}

	function handleOutroEnd(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;

		const entry = exitDom.get(el);
		if (entry) {
			exitDom.delete(el);
			// Only decrement if this element was blocking
			if (entry.blocksExit && blockingExitCount > 0) {
				blockingExitCount--;
			}
		}

		if (exitDom.size === 0) onExitComplete?.();
		if (!styles?.has(state)) {
			state.willUpdate("done");
		} else {
			removePopStyle(state);
		}
	}

	// Provide PopLayout + exit registry + wait gate to Motion children
	PresenceManagerContext.set({
		trackPosition,
		untrackPosition,
		isWaitBlocked,
		subscribeToExitStart,
		onIntroStart: handleIntroStart,
		onOutroStart: handleOutroStart,
		onOutroEnd: handleOutroEnd,
	});
</script>

{@render children()}
