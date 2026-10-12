import type { AnimatePresenceProps } from "./types.js";
import type { MotionState } from "#lib/state/motion-state.js";
import { cancelFrame, frame } from "motion-dom";
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

export function usePopLayout(props: Pick<AnimatePresenceProps, "mode" | "anchorX">) {
	const styles = new WeakMap<MotionState, HTMLStyleElement>();
	const config = useMotionConfig();

	/**
	 * React measures an exiting element right before the update that removes it. Svelte only reports the exit after
	 * that update, when new siblings may already have shifted it, so tracked elements are measured every frame (in
	 * motion's read phase) and the exit uses the last measurement.
	 */
	const trackedStates = new Set<MotionState>();
	const cachedPositions = new WeakMap<MotionState, PopSize>();

	function measureTracked() {
		for (const state of trackedStates) measureState(state);
	}

	function measureState(state: MotionState) {
		const element = state.element as HTMLElement | null;
		if (element?.isConnected) cachedPositions.set(state, measure(element));
	}

	function trackPosition(state: MotionState) {
		if (props.mode !== "popLayout") return;
		if (trackedStates.size === 0) frame.read(measureTracked, true);
		trackedStates.add(state);
		// Measure now too, in case the element exits before the next frame
		measureState(state);
	}

	function untrackPosition(state: MotionState) {
		trackedStates.delete(state);
		cachedPositions.delete(state);
		if (trackedStates.size === 0) cancelFrame(measureTracked);
	}

	function addPopStyle(state: MotionState) {
		if (props.mode !== "popLayout") return;
		const element = state.element as HTMLElement;
		const size = cachedPositions.get(state) ?? measure(element);
		untrackPosition(state);

		// Anchor to the start edge, which is the right one in RTL.
		const anchorLeft = (props.anchorX === "left") === (size.direction !== "rtl");
		const x = anchorLeft ? `left: ${size.left}px` : `right: ${size.right}px`;

		const elementPopId = `pop-${popId++}`;
		element.dataset.motionPopId = elementPopId;
		const style = document.createElement("style");
		const { nonce } = config();
		if (nonce) style.nonce = nonce;
		styles.set(state, style);
		element.ownerDocument.head.appendChild(style);
		style.sheet?.insertRule(`
    [data-motion-pop-id="${elementPopId}"] {
      position: absolute !important;
      width: ${size.width}px !important;
      height: ${size.height}px !important;
      top: ${size.top}px !important;
      ${x} !important;
      }
      `);
	}

	/** Returns whether the element was popped. */
	function removePopStyle(state: MotionState) {
		const style = styles.get(state);
		if (!style) return false;
		styles.delete(state);
		delete (state.element as HTMLElement).dataset.motionPopId;
		frame.render(() => style.remove());
		return true;
	}

	return { addPopStyle, removePopStyle, trackPosition, untrackPosition };
}
