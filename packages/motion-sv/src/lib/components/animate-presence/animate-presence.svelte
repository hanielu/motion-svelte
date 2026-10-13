<script lang="ts">
	import type { IProjectionNode } from "motion-dom";
	import type { Snippet } from "svelte";
	import type { AnimatePresenceProps } from "./types.js";
	import { mountedStates, type MotionState } from "#lib/state/motion-state.js";
	import { setPresenceManager } from "./context.js";
	import { useAnimatePresence } from "./presence.svelte.js";
	import { usePopLayout } from "./use-pop-layout.js";

	let {
		mode = "sync",
		initial = true,
		anchorX = "left",
		custom,
		onExitComplete,
		children,
	}: AnimatePresenceProps & { children: Snippet } = $props();

	const presenceContext = useAnimatePresence({
		get initial() {
			return initial;
		},
		get custom() {
			return custom;
		},
	});
	const { addPopStyle, removePopStyle, trackPosition, untrackPosition } = usePopLayout({
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

	/** Elements that are exiting. Guards against double handling; re-entry ends the session. */
	const exitDom = new Map<Element, ExitSession>();

	/**
	 * Exits that have an exit animation. In "wait" mode, motion children hide new entrants until they finish (see
	 * `isWaitBlocked` in motion.svelte).
	 */
	let blockingExitCount = $state(0);

	const isWaitBlocked = () => mode === "wait" && blockingExitCount > 0;

	function endSession(el: Element) {
		const session = exitDom.get(el);
		if (!session) return;
		exitDom.delete(el);
		if (session.blocksExit) blockingExitCount--;
	}

	/**
	 * Snapshot this AnimatePresence's layout elements before the exiting element pops out of flow (popLayout) or
	 * leaves the DOM (sync), so its siblings can FLIP from their pre-shift positions. These are the elements React
	 * re-renders when a child exits; snapshotting one also dirties the rest of its LayoutGroup, as React's forceRender
	 * does. Elements elsewhere keep animating undisturbed. Nodes already snapshotted by createLayoutMotion().update()
	 * keep their snapshot, and elements that mounted in this same update don't animate their first layout, as in React.
	 *
	 * Returns the layout pass to run once the exiting element is out of the layout. It runs even when the exiting
	 * element doesn't animate its own layout, since a snapshot left behind would later animate from a stale layout.
	 */
	function snapshotLayoutTree(state: MotionState) {
		const root: IProjectionNode | undefined = state.visualElement?.projection?.root;
		let hasSnapshot = false;
		root?.nodes?.forEach((child) => {
			const node = child as IProjectionNode;
			if (!(node.options.layout || node.options.layoutId) || !(node.instance instanceof Element)) return;
			const owner = mountedStates.get(node.instance);
			if (owner?.options.presenceContext !== presenceContext || owner.isNewlyMounted) return;
			node.willUpdate();
			hasSnapshot = true;
		});

		return () => {
			state.didUpdate();
			if (hasSnapshot && root?.isUpdating) root.didUpdate();
		};
	}

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

		endSession(el);
		removePopStyle(state);
		trackPosition(state);
		state.reenter();
	}

	const isInsideExit = (el: Element) => [...exitDom.keys()].some((exiting) => exiting !== el && exiting.contains(el));

	/**
	 * Called when Svelte starts the outro, in the microtask right after the flush that removed the element. Returns
	 * whether the element must be held until its exit completes.
	 */
	function handleOutroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return false;
		if (exitDom.has(el)) return true;

		// A layoutId element without an exit inside an exiting element leaves with it: hand the layout on, don't hold.
		if (!state.options.exit && isInsideExit(el)) {
			state.getSnapshot(state.options, false);
			state.didUpdate();
			return false;
		}

		// popLayout takes the element out of the layout now, so measure around it first. Otherwise it stays in the
		// layout until its outro ends (see handleOutroEnd), and measuring now would only finish running animations.
		const popsOut = mode === "popLayout" && !!state.options.exit;
		const updateLayout = popsOut ? snapshotLayoutTree(state) : () => state.didUpdate();
		if (popsOut) addPopStyle(state);

		const session: ExitSession = { blocksExit: !!state.options.exit, isComplete: false };
		exitDom.set(el, session);
		if (session.blocksExit) blockingExitCount++;

		state.exit().then(() => {
			if (exitDom.get(el) !== session) return;
			session.isComplete = true;
			finishOutro(el);
		});
		updateLayout();
		return true;
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

		endSession(el);
		if (exitDom.size === 0) onExitComplete?.();
		if (removePopStyle(state)) return;

		// Sync mode: the element leaves the DOM right after outroend, shifting siblings. Snapshot them now (element still
		// in flow) and run the layout pass after Svelte has removed the node.
		const updateLayout = snapshotLayoutTree(state);
		state.getSnapshot(state.options, false);
		queueMicrotask(updateLayout);
	}

	function presenceIntro(_node: Element) {
		presenceContext.isUnmounting = false;
		return {};
	}

	function presenceOutro(_node: Element) {
		presenceContext.isUnmounting = true;
		return {};
	}

	setPresenceManager({
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
