<script lang="ts">
	import { useAnimatePresence } from "./presence.svelte.js";
	import type { AnimatePresenceProps } from "./types.js";
	import { usePopLayout } from "./use-pop-layout.js";
	import type { Snippet } from "svelte";
	import { PopLayoutContext } from "./context.js";

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

	function notifyExitStart(el: Element) {
		exitDom.set(el, true);
		exitsRef++;
	}

	function notifyExitEnd(el: Element) {
		exitDom.delete(el);
		if (exitsRef > 0) exitsRef--;
		if (exitDom.size === 0) onExitComplete?.();
	}

	function isWaitBlocked() {
		return mode === "wait" && exitsRef > 0;
	}

	// Provide PopLayout + exit registry + wait gate to Motion children
	PopLayoutContext.set({
		addPopStyle,
		removePopStyle,
		styles,
		notifyExitStart,
		notifyExitEnd,
		isWaitBlocked,
		exits: {
			get value() {
				return exitsRef;
			},
		},
	});
</script>

{@render children()}
