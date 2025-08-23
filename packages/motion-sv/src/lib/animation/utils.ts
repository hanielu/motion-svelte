import type { AnimationControls } from "./types.js";

export function isAnimationControls(v?: unknown): v is AnimationControls {
	return v !== null && typeof v === "object" && typeof (v as AnimationControls).start === "function";
}

export function toMs(seconds?: number): number | undefined {
	if (seconds == null) return undefined;
	return seconds * 1000;
}

export function toSeconds(secondsOrMs?: number): number | undefined {
	if (secondsOrMs == null) return undefined;
	return secondsOrMs > 10 ? secondsOrMs / 1000 : secondsOrMs;
}

export function mapEasing(ease?: any): ((t: number) => number) | undefined {
	if (!ease) return undefined;
	if (typeof ease === "function") return ease as (t: number) => number;
	if (Array.isArray(ease)) {
		// cubic-bezier array [x1, y1, x2, y2] not directly supported by Svelte; ignore or approximate
		return undefined;
	}
	if (typeof ease === "string") {
		switch (ease) {
			case "linear":
				return (t) => t;
			case "easeIn":
				return (t) => t * t;
			case "easeOut":
				return (t) => 1 - (1 - t) * (1 - t);
			case "easeInOut":
				return (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
			default:
				return undefined;
		}
	}
	return undefined;
}
