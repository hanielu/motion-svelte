<script lang="ts">
	import { useAnimatePresence } from "./presence.svelte.js";
	import type { AnimatePresenceProps } from "./types.js";
	import { usePopLayout } from "./use-pop-layout.js";
	import type { Snippet } from "svelte";
	import { PopLayoutContext } from "./index.js";
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

	// Track elements that are actively exiting AND blocking (have actual exit animations)
	const exitDom = new Map<Element, { blocksExit: boolean }>();
	let exitsRef = $state(0);

	// Subscribers to be notified when a blocking exit starts
	const exitStartSubscribers = new Set<() => void>();
	function subscribeToExitStart(callback: () => void): () => void {
		exitStartSubscribers.add(callback);
		return () => exitStartSubscribers.delete(callback);
	}
	function notifyExitStart() {
		exitStartSubscribers.forEach((cb) => cb());
	}

	$effect.pre(() => {
		return () => {
			exitDom.clear();
			exitsRef = 0;
			exitStartSubscribers.clear();
		};
	});

	function isWaitBlocked() {
		return mode === "wait" && exitsRef > 0;
	}

	function handleIntroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;

		// Clean up exit state if this element was exiting
		const entry = exitDom.get(el);
		if (entry) {
			exitDom.delete(el);
			if (entry.blocksExit && exitsRef > 0) {
				exitsRef--;
			}
		}

		removePopStyle(state);
		// Re-track position for popLayout mode since element is re-entering
		trackPosition(state);
		state.isVShow = true;
		removeDoneCallback(el);
		// Reset exit without animating
		state.setActive?.("exit", false, false);
		// Resume enter animation from current values
		state.startAnimation?.();
	}

	function handleOutroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		if (exitDom.has(el)) return;

		addPopStyle(state);
		state.isVShow = false;

		// Only elements with an actual exit animation should block.
		// Elements with only layoutId (no exit) should run their layout animation
		// in parallel without blocking other animations.
		const blocksExit = !!state.options.exit;

		exitDom.set(el, { blocksExit });

		// Only increment the blocking counter for elements that should block
		if (blocksExit) {
			exitsRef++;
			// Notify layout-only elements to start their animations in parallel
			notifyExitStart();
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
			if (entry.blocksExit && exitsRef > 0) {
				exitsRef--;
			}
		}

		if (exitDom.size === 0) onExitComplete?.();
		if (!styles?.has(state)) {
			state.willUpdate("done");
		} else {
			removePopStyle?.(state);
		}
	}

	// Provide PopLayout + exit registry + wait gate to Motion children
	PopLayoutContext.set({
		trackPosition,
		untrackPosition,
		isWaitBlocked,
		subscribeToExitStart,
		exits: {
			get value() {
				return exitsRef;
			},
		},
		onIntroStart: handleIntroStart,
		onOutroStart: handleOutroStart,
		onOutroEnd: handleOutroEnd,
	});
</script>

{@render children()}
