import type { AnimatePresenceProps } from "./types.js";
import type { MotionState } from "#lib/state/motion-state.js";
import { frame } from "motion-dom";
import { useMotionConfig } from "../motion-config/index.js";

let popId = 0;

interface PopSize {
	width: number;
	height: number;
	top: number;
	left: number;
	right: number;
	direction: string;
}

/** The computed size keeps sub-pixel and content-box widths, which offsetWidth/offsetHeight don't. */
function measure(element: HTMLElement): PopSize {
	const parent = element.offsetParent;
	const parentWidth = parent instanceof HTMLElement ? parent.offsetWidth || 0 : 0;
	const style = getComputedStyle(element);
	const width = parseFloat(style.width);
	const left = element.offsetLeft;
	return {
		width,
		height: parseFloat(style.height),
		top: element.offsetTop,
		left,
		right: parentWidth - width - left,
		direction: style.direction,
	};
}

export function usePopLayout(props: AnimatePresenceProps) {
	const styles = new WeakMap<MotionState, HTMLStyleElement>();
	// Cache of positions captured continuously via rAF - always has the "stable" position
	const cachedPositions = new WeakMap<MotionState, PopSize>();
	// Track states that are being monitored
	const trackedStates = new Set<MotionState>();
	let rafId: number | null = null;
	const config = useMotionConfig();

	/**
	 * Continuously capture positions of tracked elements.
	 * Runs every frame to ensure we always have the latest stable position.
	 */
	function updatePositions() {
		for (const state of trackedStates) capturePositionSync(state);

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
		cachedPositions.set(state, measure(element));
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

		// Use the cached position if available, otherwise measure now (may be off if the DOM has shifted)
		const size = cachedPositions.get(state) ?? measure(element);
		cachedPositions.delete(state);

		// Anchor to the start edge, which is the right one in RTL.
		const anchorLeft = (props.anchorX === "left") === (size.direction !== "rtl");
		const x = anchorLeft ? `left: ${size.left}px` : `right: ${size.right}px`;

		// Use unique pop id for CSS selector
		const elementPopId = `pop-${popId++}`;
		(state.element as HTMLElement).dataset.motionPopId = elementPopId;
		const style = document.createElement("style");
		if (config().nonce) {
			style.nonce = config().nonce;
		}
		styles.set(state, style);
		element.ownerDocument.head.appendChild(style);
		if (style.sheet) {
			style.sheet.insertRule(`
    [data-motion-pop-id="${elementPopId}"] {
      position: absolute !important;
      width: ${size.width}px !important;
      height: ${size.height}px !important;
      top: ${size.top}px !important;
      ${x} !important;
      }
      `);
		}
	}

	function removePopStyle(state: MotionState) {
		const style = styles.get(state);
		if (!style) return;
		styles.delete(state);
		delete (state.element as HTMLElement).dataset.motionPopId;
		frame.render(() => style.remove());
	}

	return {
		addPopStyle,
		removePopStyle,
		trackPosition,
		untrackPosition,
		styles,
	};
}
