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

	$effect(() => {
		return () => {
			exitDom.clear();
		};
	});

	function notifyExitStart(el: Element) {
		exitDom.set(el, true);
	}

	function notifyExitEnd(el: Element) {
		exitDom.delete(el);
		if (exitDom.size === 0) onExitComplete?.();
	}

	// Provide PopLayout + exit registry to Motion children
	PopLayoutContext.set({ addPopStyle, removePopStyle, styles, notifyExitStart, notifyExitEnd });
</script>

{@render children()}
