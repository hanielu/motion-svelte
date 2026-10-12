<script lang="ts">
	import { useAnimatePresence } from "./presence.svelte.js";
	import type { AnimatePresenceProps } from "./types.js";
	import { usePopLayout } from "./use-pop-layout.js";
	import type { Snippet } from "svelte";
	import { PresenceManagerContext } from "./index.js";
	import { mountedStates } from "#lib/state/motion-state.js";
	import type { MotionState } from "#lib/state/motion-state.js";

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

	interface ExitSession {
		/** Whether this exit blocks "wait" mode. */
		blocksExit: boolean;
		/** The exit animation (and any layoutId handoff) has finished. */
		isComplete: boolean;
	}

	/** Elements that are exiting. Guards against double handling; re-entry deletes the session. */
	const exitDom = new Map<Element, ExitSession>();

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

	$effect.pre(() => () => {
		exitDom.clear();
		blockingExitCount = 0;
	});

	const isWaitBlocked = () => mode === "wait" && blockingExitCount > 0;

	/**
	 * Snapshot every layout-enabled projection node in the tree before the exiting element pops out of flow
	 * (popLayout) or leaves the DOM (sync), so siblings can FLIP from their pre-shift positions. Nodes already
	 * snapshotted by createLayoutMotion().update() keep their snapshot; nodes that don't move won't animate. Nodes
	 * that haven't been measured yet just mounted, and like in React they don't animate their first layout.
	 */
	function snapshotLayoutTree(state: MotionState) {
		const root = state.visualElement?.projection?.root;
		if (!root) return;
		(root as any).nodes?.forEach((node: any) => {
			if (node.layout && (node.options.layout || node.options.layoutId)) {
				node.willUpdate(false);
			}
		});
	}

	const presenceContext = useAnimatePresence({
		get initial() {
			return initial;
		},
		get custom() {
			return custom;
		},
	});

	/**
	 * Svelte keeps an exiting element until its outro's duration has passed. Finish that outro as soon as the exit is
	 * complete, so the element leaves exactly when its animation ends, as in React.
	 */
	function finishOutro(el: Element) {
		for (const animation of el.getAnimations()) {
			const effect = animation.effect as KeyframeEffect | null;
			// Svelte's outro animates no keyframes; motion's own animations on the element always do.
			if (effect?.getKeyframes().length !== 0 || !(Number(effect.getTiming().duration) > 0)) continue;
			// Run Svelte's finish handler now instead of on the next frame's finish event.
			const onfinish = animation.onfinish;
			animation.onfinish = null;
			animation.finish();
			onfinish?.call(animation, new AnimationPlaybackEvent("finish"));
		}
	}

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

		state.reenter();
	}

	/** Called when Svelte starts the outro, in the microtask right after the flush that removed the element. */
	function handleOutroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		if (exitDom.has(el)) return;

		snapshotLayoutTree(state);
		addPopStyle(state);

		const session: ExitSession = { blocksExit: !!state.options.exit, isComplete: false };
		exitDom.set(el, session);
		if (session.blocksExit) blockingExitCount++;

		state.exit().then(() => {
			if (exitDom.get(el) !== session) return;
			session.isComplete = true;
			finishOutro(el);
		});
		state.didUpdate();
	}

	/**
	 * Svelte creates the outro animation a frame after starting it, right after `outrostart`. An exit that completed
	 * before then finishes it here.
	 */
	function handleOutroBegin(el: Element) {
		if (exitDom.get(el)?.isComplete) queueMicrotask(() => finishOutro(el));
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
		onIntroStart: handleIntroStart,
		onOutroStart: handleOutroStart,
		onOutroBegin: handleOutroBegin,
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
