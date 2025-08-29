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

	const { addPopStyle, removePopStyle, styles } = usePopLayout({
		get mode() {
			return mode;
		},
		get anchorX() {
			return anchorX;
		},
	});

	const exitDom = new Map<Element, boolean>();
	let exitsRef = $state(0);

	$effect.pre(() => {
		return () => {
			exitDom.clear();
			exitsRef = 0;
		};
	});

	function isWaitBlocked() {
		return mode === "wait" && exitsRef > 0;
	}

	function handleIntroStart(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		removePopStyle?.(state);
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
		addPopStyle?.(state);
		state.isVShow = false;
		exitDom.set(el, true);
		exitsRef++;
		// Defer to next microtask to ensure updated layout/values
		delay(() => {
			state.setActive?.("exit", true);
		});
	}

	function handleOutroEnd(el: Element) {
		const state = mountedStates.get(el);
		if (!state) return;
		exitDom.delete(el);
		if (exitsRef > 0) exitsRef--;
		if (exitDom.size === 0) onExitComplete?.();
		if (!styles?.has(state)) {
			state.willUpdate("done");
		} else {
			removePopStyle?.(state);
		}
	}

	// Provide PopLayout + exit registry + wait gate to Motion children
	PopLayoutContext.set({
		addPopStyle,
		removePopStyle,
		styles,
		isWaitBlocked,
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
