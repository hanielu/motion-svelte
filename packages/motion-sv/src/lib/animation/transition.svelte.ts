import type { MotionExitDefinition, MotionTransitionParamsShape } from "./types.js";
import { toMs, mapEasing } from "./utils.js";
import { findValueType, complex } from "motion-dom";
import { style as styleUtils } from "@/state/style.js";
import { buildTransformTemplate, transformAlias, transformDefinitions } from "@/state/transform.js";

export function motionExit(node: Element, params?: MotionTransitionParamsShape) {
	const def: MotionExitDefinition = params?.definition || {};
	const { transition, ...target } = def as unknown as Record<string, unknown> & {
		transition?: MotionExitDefinition["transition"];
	};

	const baseDuration = toMs(transition?.duration) ?? 200;
	const delay = toMs(transition?.delay) ?? 0;
	const easing = mapEasing(transition?.ease);

	const seen = (motionExit as any)._seen || new WeakSet<Element>();
	(motionExit as any)._seen = seen;
	const isIntroCall = !seen.has(node);
	if (isIntroCall) {
		seen.add(node);
		node.addEventListener(
			"outroend",
			() => {
				params!.allowIntro = true;
			},
			{ once: true }
		);
	}

	const duration = isIntroCall && !params?.allowIntro ? 0 : baseDuration;

	type Mixer = (p: number) => string;
	const styleMixers: Array<[string, Mixer]> = [];
	const transformMixers: Array<[string, Mixer]> = [];

	for (const rawKey in target) {
		let key = rawKey;
		if (rawKey in transformAlias) key = (transformAlias as Record<string, string>)[rawKey];

		const to = (target as Record<string, unknown>)[rawKey];
		const transformDef = transformDefinitions.get(key);
		if (transformDef) {
			const fromOverride = params?.from?.[rawKey] as unknown;
			const fromRaw = fromOverride ?? (transformDef.initialValue as unknown);
			const fromNum = typeof fromRaw === "number" ? (fromRaw as number) : parseFloat(String(fromRaw)) || 0;
			const toNum = typeof to === "number" ? (to as number) : parseFloat(String(to)) || 0;
			const unit = transformDef.toDefaultUnit
				? (v: number) => String(transformDef.toDefaultUnit(v))
				: (v: number) => String(v);
			const mix: Mixer = (p) => unit(fromNum + (toNum - fromNum) * p);
			transformMixers.push([key, mix]);
			continue;
		}

		const fromStr = String(params?.from?.[key] ?? styleUtils.get(node, key) ?? "");
		const toStr = String(to);

		// Direct numeric properties like opacity
		if (key === "opacity") {
			const fromNum = parseFloat(fromStr || "1");
			const toNum = parseFloat(toStr || "0");
			const mix: Mixer = (p) => String(fromNum + (toNum - fromNum) * p);
			styleMixers.push([key, mix]);
			continue;
		}

		const valueType = findValueType(toStr) || findValueType(fromStr);
		if (valueType) {
			const parse = (valueType as any).parse ?? ((v: unknown) => v as number);
			const toOut: (v: unknown) => string = (valueType as any).transform ?? ((v: unknown) => String(v));
			const fromParsed = parse(fromStr) as number;
			const toParsed = parse(toStr) as number;
			const mix: Mixer = (p) => String(toOut(fromParsed + (toParsed - fromParsed) * p));
			styleMixers.push([key, mix]);
		} else {
			// Robust complex interpolation using motion-dom complex helpers
			const toTransformer = complex.createTransformer(toStr) as ((values: unknown) => string) | undefined;
			if (toTransformer) {
				let fromVals = complex.parse(fromStr) as number[];
				let toVals = complex.parse(toStr) as number[];
				if (!Array.isArray(fromVals) || fromVals.length !== toVals.length) {
					const none = complex.getAnimatableNone(toStr) as string;
					fromVals = complex.parse(none) as number[];
				}
				const mix: Mixer = (p) => {
					const mixed = toVals.map((tv: number, i: number) => {
						const fv = fromVals[i] ?? 0;
						return fv + (tv - fv) * p;
					});
					return toTransformer(mixed);
				};
				styleMixers.push([key, mix]);
			} else {
				styleMixers.push([key, (_p) => toStr]);
			}
		}
	}

	function toCss(_t: number, u: number) {
		const p = u;
		const parts: string[] = [];
		for (const [prop, mix] of styleMixers) {
			parts.push(`${prop}:${mix(p)};`);
		}
		if (transformMixers.length) {
			const transforms: [string, string][] = transformMixers.map(([name, mix]) => [name, mix(p)]);
			parts.push(`transform:${buildTransformTemplate(transforms)};`);
		}
		return parts.join("");
	}

	return { delay, duration, easing, css: toCss } as const;
}
