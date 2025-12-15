import type { AnimatePresenceProps } from "./types.js";
import type { MotionState } from "@/state/motion-state.js";
import { frame } from "framer-motion/dom";
import { useMotionConfig } from "../motion-config/index.js";

export function usePopLayout(props: AnimatePresenceProps) {
	const styles = new WeakMap<MotionState, HTMLStyleElement>();
	// Cache of positions captured continuously via rAF - always has the "stable" position
	const cachedPositions = new WeakMap<
		MotionState,
		{ width: number; height: number; top: number; left: number; right: number }
	>();
	// Track states that are being monitored
	const trackedStates = new Set<MotionState>();
	let rafId: number | null = null;
	const config = useMotionConfig();

	/**
	 * Continuously capture positions of tracked elements.
	 * Runs every frame to ensure we always have the latest stable position.
	 */
	function updatePositions() {
		for (const state of trackedStates) {
			const element = state.element as HTMLElement;
			if (!element || !element.isConnected) continue;

			const parent = element.offsetParent;
			const parentWidth = parent instanceof HTMLElement ? parent.offsetWidth || 0 : 0;
			const size = {
				height: element.offsetHeight || 0,
				width: element.offsetWidth || 0,
				top: element.offsetTop,
				left: element.offsetLeft,
				right: 0,
			};
			size.right = parentWidth - size.width - size.left;
			cachedPositions.set(state, size);
		}

		if (trackedStates.size > 0) {
			rafId = requestAnimationFrame(updatePositions);
		} else {
			rafId = null;
		}
	}

	/**
	 * Capture position for a single element synchronously.
	 */
	function capturePositionSync(state: MotionState) {
		const element = state.element as HTMLElement;
		if (!element || !element.isConnected) return;

		const parent = element.offsetParent;
		const parentWidth = parent instanceof HTMLElement ? parent.offsetWidth || 0 : 0;
		const size = {
			height: element.offsetHeight || 0,
			width: element.offsetWidth || 0,
			top: element.offsetTop,
			left: element.offsetLeft,
			right: 0,
		};
		size.right = parentWidth - size.width - size.left;
		cachedPositions.set(state, size);
	}

	/**
	 * Start tracking a state's position continuously.
	 */
	function trackPosition(state: MotionState) {
		if (props.mode !== "popLayout") return;
		trackedStates.add(state);

		// Capture position immediately so we have it even if element exits before rAF
		capturePositionSync(state);

		if (rafId === null) {
			rafId = requestAnimationFrame(updatePositions);
		}
	}

	/**
	 * Stop tracking a state's position.
	 */
	function untrackPosition(state: MotionState) {
		trackedStates.delete(state);
		cachedPositions.delete(state);
	}

	function addPopStyle(state: MotionState) {
		if (props.mode !== "popLayout") return;
		const element = state.element as HTMLElement;

		// Stop tracking this element since it's exiting
		trackedStates.delete(state);

		// Use cached position if available, otherwise measure now (fallback)
		let size = cachedPositions.get(state);
		if (!size) {
			// Fallback: measure now (may be incorrect if DOM has shifted)
			const parent = element.offsetParent;
			const parentWidth = parent instanceof HTMLElement ? parent.offsetWidth || 0 : 0;
			size = {
				height: element.offsetHeight || 0,
				width: element.offsetWidth || 0,
				top: element.offsetTop,
				left: element.offsetLeft,
				right: 0,
			};
			size.right = parentWidth - size.width - size.left;
		}
		// Clear the cache after use
		cachedPositions.delete(state);

		const x = props.anchorX === "left" ? `left: ${size.left}` : `right: ${size.right}`;

		state.element.dataset.motionPopId = state.id;
		const style = document.createElement("style");
		if (config().nonce) {
			style.nonce = config().nonce;
		}
		styles.set(state, style);
		document.head.appendChild(style);
		if (style.sheet) {
			style.sheet.insertRule(`
    [data-motion-pop-id="${state.id}"] {
      position: absolute !important;
      width: ${size.width}px !important;
      height: ${size.height}px !important;
      top: ${size.top}px !important;
      ${x}px !important;
      }
      `);
		}
	}

	function removePopStyle(state: MotionState) {
		const style = styles.get(state);
		if (!style) return;
		styles.delete(state);
		frame.render(() => {
			document.head.removeChild(style);
		});
	}

	return {
		addPopStyle,
		removePopStyle,
		trackPosition,
		untrackPosition,
		styles,
	};
}
