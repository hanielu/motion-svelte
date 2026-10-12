<script lang="ts">
	import { useAnimatePresence } from "./presence.svelte.js";
	import type { AnimatePresenceProps } from "./types.js";
	import { usePopLayout } from "./use-pop-layout.js";
	import type { Snippet } from "svelte";
	import { PresenceManagerContext } from "./index.js";
	import { mountedStates } from "#lib/state/motion-state.js";
	import type { MotionState } from "#lib/state/motion-state.js";
	import { delay } from "#lib/utils/delay.js";

	let {
		mode = "sync",
		initial = true,
		anchorX = "left",
		as,
		custom,
		onExitComplete,
		children,
	}: AnimatePresenceProps & { children: Snippet } = $props();

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

	/**
	 * Called by MotionState (via ProjectionFeature / setActive("exit", true) promise)
	 * when a motion component's exit animation truly completes. Used for popLayout
	 * style cleanup and layout bookkeeping — DOM removal timing stays with Svelte's outro.
	 */
	function handleMotionExitComplete(container: HTMLElement | null, state: MotionState) {
		if (styles.has(state)) {
			removePopStyle(state);
		}
	}

	/**
	 * Snapshot every layout-enabled projection node in the tree.
	 *
	 * Svelte dispatches `outrostart`/`outroend` a frame after the flush (behind a
	 * 0-duration WAAPI placeholder), so by the time an exiting element pops out of
	 * flow (popLayout) or is removed from the DOM (sync), the regular pre-update
	 * snapshots have already been consumed by an earlier didUpdate pass. Re-snapshot
	 * here so siblings can FLIP from their pre-shift positions; nodes that don't
	 * move resolve to zero deltas and won't animate.
	 */
	function snapshotLayoutTree(state: MotionState) {
		const root = state.visualElement?.projection?.root;
		if (!root) return;
		(root as any).nodes?.forEach((node: any) => {
			if (node.options.layout || node.options.layoutId) {
				node.willUpdate(false);
			}
		});
	}

	const presenceContext = useAnimatePresence(
		{
			// svelte-ignore state_referenced_locally - `initial` only applies to children present at mount
			initial,
			get custom() {
				return custom;
			},
		},
		handleMotionExitComplete
	);

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

		// Resume enter animation from current values
		state.setActive("exit", false);
		state.getSnapshot(state.options, true);
	}

	function handleOutroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		if (exitDom.has(el)) return;

		// Capture pre-exit positions of the whole layout tree BEFORE popLayout pulls
		// this element out of flow, so siblings can FLIP to their new positions.
		snapshotLayoutTree(state);

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

		state.presenceContainer = el as HTMLElement;

		// Defer to next microtask to ensure updated layout/values
		delay(() => {
			state.setActive("exit", true);
			state.getSnapshot(state.options, false);
			state.didUpdate();
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
			// Sync mode: the element leaves the DOM right after outroend, shifting
			// siblings. Snapshot the tree now (element still in flow) and run the
			// layout pass after Svelte has removed the node.
			snapshotLayoutTree(state);
			state.getSnapshot(state.options, false);
			queueMicrotask(() => {
				state.didUpdate();
			});
		} else {
			removePopStyle(state);
		}
	}

	function presenceIntro(_node: Element) {
		presenceContext.isUnmounting = false;
		return {};
	}

	function presenceOutro(_node: Element) {
		presenceContext.isUnmounting = true;
		return {};
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

<!--
	Children exit through `|global` transitions, which Svelte also plays when any ancestor block is destroyed, so they
	would keep a destroyed route or parent on screen until their exits finish (#18). Svelte runs this sentinel's outro
	only when AnimatePresence itself is being destroyed, and before its children's, so they skip their exits. It lives
	in <head> so it never affects the surrounding markup.
-->
<svelte:head>
	<template data-motion-presence in:presenceIntro|global out:presenceOutro|global></template>
</svelte:head>
{@render children()}
