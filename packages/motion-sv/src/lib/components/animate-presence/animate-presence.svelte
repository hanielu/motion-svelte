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
	 * Snapshot every layout-enabled projection node in the tree before the exiting element pops out of flow
	 * (popLayout) or leaves the DOM (sync), so siblings can FLIP from their pre-shift positions. Nodes already
	 * snapshotted by createLayoutMotion().update() keep their snapshot; nodes that don't move won't animate. Elements
	 * that mounted in this same update don't animate their first layout, as in React.
	 */
	function snapshotLayoutTree(state: MotionState) {
		const root: IProjectionNode | undefined = state.visualElement?.projection?.root;
		root?.nodes?.forEach((child) => {
			const node = child as IProjectionNode;
			if (!(node.options.layout || node.options.layoutId)) return;
			if (node.instance instanceof Element && mountedStates.get(node.instance)?.isNewlyMounted) return;
			node.willUpdate(false);
		});
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

		snapshotLayoutTree(state);
		if (state.options.exit) addPopStyle(state);

		const session: ExitSession = { blocksExit: !!state.options.exit, isComplete: false };
		exitDom.set(el, session);
		if (session.blocksExit) blockingExitCount++;

		state.exit().then(() => {
			if (exitDom.get(el) !== session) return;
			session.isComplete = true;
			finishOutro(el);
		});
		state.didUpdate();
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

		// Sync mode: the element leaves the DOM right after outroend, shifting siblings. Snapshot the tree now (element
		// still in flow) and run the layout pass after Svelte has removed the node.
		snapshotLayoutTree(state);
		state.getSnapshot(state.options, false);
		queueMicrotask(() => state.didUpdate());
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
