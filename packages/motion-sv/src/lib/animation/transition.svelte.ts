import type { MotionExitDefinition, MotionTransitionParamsShape } from "./types.js";
import type { TransitionConfig } from "svelte/transition";
import { findValueType, spring, calcGeneratorDuration } from "framer-motion/dom";
import { style as styleUtils } from "@/state/style.js";
import { transformAlias, transformDefinitions } from "@/state/transform.js";
// Use FM internals for parity
import { getValueTransition } from "framer-motion/dist/es/animation/sequence/create.mjs";
import { getDefaultTransition } from "framer-motion/dist/es/animation/utils/default-transitions.mjs";

function toMs(seconds?: number): number | undefined {
	if (seconds == null) return undefined;
	return seconds * 1000;
}

export function motionExit(node: Element, params: MotionTransitionParamsShape): TransitionConfig | null {
	const def: MotionExitDefinition = params.definition;
	const { transition: baseTransition, ...target } = def || {};

	const baseDuration = toMs(baseTransition?.duration) ?? 200;
	const baseDelay = toMs(baseTransition?.delay) ?? 0;

	const seen = (motionExit as any)._seen || new WeakSet<Element>();
	(motionExit as any)._seen = seen;
	const isIntroCall = !seen.has(node);
	if (isIntroCall) {
		seen.add(node);
		node.addEventListener("outroend", () => params.setAllowIntro(true), { once: true });
	}

	// If this is the initial intro and we haven't been allowed to run, skip the transition entirely
	if (isIntroCall && !params.allowIntro) return null;

	const state = params.state;

	let overallDurationMs = 0;
	// We only compute overall duration; animation is driven externally by AnimatePresence handlers

	function mergeValueTransition(base: any, key: string): any {
		// Prefer FM's merge semantics when available
		try {
			return getValueTransition(base || {}, key);
		} catch {
			return base || {};
		}
	}

	function applyDefaultTransition(key: string, vt: any, fromValue: any, toValue: any) {
		try {
			const opts: any = { keyframes: [fromValue, toValue] };
			const defaults = getDefaultTransition(key, opts);
			return { ...defaults, ...vt };
		} catch {
			return vt;
		}
	}

	function hasExplicitTransition(t: any): boolean {
		if (!t) return false;
		return (
			"type" in t ||
			"stiffness" in t ||
			"damping" in t ||
			"duration" in t ||
			"ease" in t ||
			"velocity" in t ||
			"repeat" in t ||
			"repeatType" in t ||
			"repeatDelay" in t
		);
	}

	// Compute hold duration based on exit targets
	for (const rawKey in target) {
		let key = rawKey;
		if (rawKey in transformAlias) key = transformAlias[rawKey];

		const to = target[rawKey];
		let vt = mergeValueTransition(baseTransition, rawKey) || {};
		const transformDef = transformDefinitions.get(key);
		const fromValueRaw =
			state.visualElement?.latestValues?.[rawKey] ??
			(transformDef ? transformDef.initialValue : styleUtils.get(node, key));
		const fromValueStr = String(fromValueRaw ?? "");
		const toValueStr = String(to);

		if (!hasExplicitTransition(vt)) {
			vt = applyDefaultTransition(
				key,
				vt,
				transformDef ? (typeof fromValueRaw === "number" ? fromValueRaw : parseFloat(fromValueStr) || 0) : fromValueStr,
				transformDef ? (typeof to === "number" ? to : parseFloat(toValueStr) || 0) : toValueStr
			);
		}

		const delayMs = toMs(vt?.delay) ?? baseDelay;

		if (transformDef) {
			const fromNum = typeof fromValueRaw === "number" ? fromValueRaw : parseFloat(String(fromValueRaw)) || 0;
			const toNum = typeof to === "number" ? to : parseFloat(String(to)) || 0;
			const preferSpring =
				vt?.type === "spring" || vt?.stiffness !== undefined || vt?.damping !== undefined || !hasExplicitTransition(vt);
			const vel = state?.visualElement?.getValue?.(key)?.getVelocity?.() ?? 0;
			const baseDurMs = ((): number => {
				const specified = toMs(vt?.duration);
				if (specified != null) return specified;
				if (preferSpring) {
					try {
						const gen = spring({ from: fromNum, to: toNum, velocity: vel, ...vt });
						const approx = calcGeneratorDuration(gen);
						if (approx != null && isFinite(approx)) return approx;
						return 300;
					} catch {
						return 300;
					}
				}
				return baseDuration;
			})();
			const repeatCount = Math.max(0, (vt?.repeat as number) ?? 0);
			const repeatDelayMs = toMs(vt?.repeatDelay) ?? 0;
			const durMs = baseDurMs * (repeatCount + 1) + repeatDelayMs * repeatCount;
			overallDurationMs = Math.max(overallDurationMs, delayMs + durMs);
			continue;
		}

		const fromStr = fromValueStr;
		const toStr = toValueStr;

		const valueType = findValueType(toStr) || findValueType(fromStr);
		if (valueType) {
			const parse = valueType.parse ?? ((v: unknown) => v as number);
			const fromParsed = parse(fromStr) as number;
			const toParsed = parse(toStr) as number;
			const preferSpring =
				vt?.type === "spring" || vt?.stiffness !== undefined || vt?.damping !== undefined || !hasExplicitTransition(vt);
			const vel = state?.visualElement?.getValue?.(key)?.getVelocity?.() ?? 0;
			const baseDurMs =
				toMs(vt?.duration) ??
				(preferSpring
					? (() => {
							try {
								const gen = spring({ from: fromParsed, to: toParsed, velocity: vel, ...vt });
								const approx = calcGeneratorDuration(gen);
								return approx != null && isFinite(approx as number) ? approx : 300;
							} catch {
								return 300;
							}
						})()
					: baseDuration);
			const repeatCount = Math.max(0, (vt?.repeat as number) ?? 0);
			const repeatDelayMs = toMs(vt?.repeatDelay) ?? 0;
			const durMs = baseDurMs * (repeatCount + 1) + repeatDelayMs * repeatCount;
			overallDurationMs = Math.max(overallDurationMs, delayMs + durMs);
		} else {
			const durMs = toMs(vt?.duration) ?? baseDuration;
			overallDurationMs = Math.max(overallDurationMs, delayMs + durMs);
		}
	}

	return { duration: overallDurationMs };
}
