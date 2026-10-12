import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Page, TestInfo } from "@playwright/test";

/** What is recorded for every element under the root, every recorded frame. */
export interface ElementState {
	/** x, y, width, height relative to the root element. */
	box: [number, number, number, number];
	[style: string]: string | number | number[];
}

export type Frame = Record<string, ElementState>;

/**
 * Delta-encoded trace: for every element, only the frames where something changed, with only the values that
 * changed. `null` means the element left the DOM.
 */
export interface Trace {
	frames: number;
	/** Fake time of each recorded frame, in ms. */
	times: number[];
	elements: Record<string, Record<number, Partial<ElementState> | null>>;
}

const BASELINES_DIR = join(import.meta.dirname, "..", "baselines", process.platform);

/** Samples every element under `rootSelector`. Runs in the page, so it must be self-contained. */
export function sampleFrame(rootSelector: string): Frame {
	const STYLES = [
		"opacity",
		"transform",
		"backgroundColor",
		"color",
		"borderRadius",
		"clipPath",
		"filter",
		"boxShadow",
		"visibility",
	];
	const SVG_STYLES = ["fill", "stroke", "strokeDasharray", "strokeDashoffset"];

	const root = document.querySelector(rootSelector);
	if (!root) throw new Error(`Trace root "${rootSelector}" not found`);

	// Elements get a stable key on first sight, in document order, so keys survive siblings being added or removed.
	const w = window as unknown as { __traceKeys?: WeakMap<Element, string>; __traceNext?: number };
	const keys = (w.__traceKeys ??= new WeakMap());
	let next = w.__traceNext ?? 0;

	const label = (el: Element) => {
		const tag = el.tagName.toLowerCase();
		if (el.id) return `${tag}#${el.id}`;
		const className = el.getAttribute("class")?.trim().split(/\s+/)[0];
		return className ? `${tag}.${className.slice(0, 24)}` : tag;
	};
	const round = (n: number) => Math.round(n * 100) / 100;

	const origin = root.getBoundingClientRect();
	const frame: Frame = {};
	for (const el of root.querySelectorAll("*")) {
		let key = keys.get(el);
		if (!key) keys.set(el, (key = `${next++}:${label(el)}`));

		const rect = el.getBoundingClientRect();
		const computed = getComputedStyle(el) as unknown as Record<string, string>;
		const state: ElementState = {
			box: [round(rect.x - origin.x), round(rect.y - origin.y), round(rect.width), round(rect.height)],
		};
		for (const style of STYLES) state[style] = style === "opacity" ? round(Number(computed.opacity)) : computed[style];
		if (el instanceof SVGElement) for (const style of SVG_STYLES) state[style] = computed[style];
		// Path data can be thousands of characters (morphing); its bounds and length change whenever the shape does.
		if (el instanceof SVGGeometryElement) {
			const bounds = el.getBBox();
			state.geometry = [
				round(bounds.x),
				round(bounds.y),
				round(bounds.width),
				round(bounds.height),
				round(el.getTotalLength()),
			];
		}
		frame[key] = state;
	}
	w.__traceNext = next;
	return frame;
}

export class TraceRecorder {
	private readonly frames: Frame[] = [];
	private readonly times: number[] = [];

	constructor(
		private readonly page: Page,
		private readonly rootSelector: string
	) {}

	async record(time: number) {
		this.frames.push(await this.page.evaluate(sampleFrame, this.rootSelector));
		this.times.push(time);
	}

	trace(): Trace {
		return encode(this.frames, this.times);
	}
}

function encode(frames: Frame[], times: number[]): Trace {
	const elements: Trace["elements"] = {};
	const keys = [...new Set(frames.flatMap((frame) => Object.keys(frame)))];
	for (const key of keys) {
		const changes: Trace["elements"][string] = {};
		let previous: ElementState | null = null;
		frames.forEach((frame, index) => {
			const current = frame[key] ?? null;
			if (current === null) {
				if (previous !== null) changes[index] = null;
			} else if (previous === null) {
				changes[index] = current;
			} else {
				const delta = Object.fromEntries(
					Object.entries(current).filter(([prop, value]) => JSON.stringify(value) !== JSON.stringify(previous![prop]))
				);
				if (Object.keys(delta).length) changes[index] = delta;
			}
			previous = current;
		});
		elements[key] = changes;
	}
	return { frames: frames.length, times, elements };
}

function decode(trace: Trace): Map<string, (ElementState | null)[]> {
	const dense = new Map<string, (ElementState | null)[]>();
	for (const [key, changes] of Object.entries(trace.elements)) {
		const states: (ElementState | null)[] = [];
		let current: ElementState | null = null;
		for (let index = 0; index < trace.frames; index++) {
			if (index in changes) {
				const change = changes[index];
				current = change === null ? null : ({ ...(current ?? {}), ...change } as ElementState);
			}
			states.push(current);
		}
		dense.set(key, states);
	}
	return dense;
}

/** One line per element-frame entry, so baselines diff readably in git. */
function serialize(trace: Trace): string {
	const elements = Object.entries(trace.elements).map(([key, changes]) => {
		const entries = Object.entries(changes).map(
			([frame, state]) => `\t\t\t${JSON.stringify(frame)}: ${JSON.stringify(state)}`
		);
		return `\t\t${JSON.stringify(key)}: {\n${entries.join(",\n")}\n\t\t}`;
	});
	return `{\n\t"frames": ${trace.frames},\n\t"times": ${JSON.stringify(trace.times)},\n\t"elements": {\n${elements.join(",\n")}\n\t}\n}\n`;
}

const NUMBER = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

/** Equal within rounding noise: half a pixel for boxes, a hundredth for opacity, ~0.2% for any other number. */
function same(prop: string, expected: unknown, actual: unknown): boolean {
	const close = (a: number, b: number) =>
		Math.abs(a - b) <= (prop === "box" ? 0.5 : prop === "opacity" ? 0.01 : 0.01 + 0.002 * Math.abs(a));
	if (typeof expected === "number" && typeof actual === "number") return close(expected, actual);
	if (Array.isArray(expected) && Array.isArray(actual))
		return expected.length === actual.length && expected.every((n, i) => close(n, actual[i]));
	if (typeof expected !== "string" || typeof actual !== "string") return expected === actual;
	if (expected.replace(NUMBER, "#") !== actual.replace(NUMBER, "#")) return false;
	const a = expected.match(NUMBER) ?? [];
	const b = actual.match(NUMBER) ?? [];
	return a.every((n, i) => close(Number(n), Number(b[i])));
}

interface ElementDiff {
	key: string;
	first: number;
	last: number;
	count: number;
	detail: string;
}

export function compareTraces(expected: Trace, actual: Trace): ElementDiff[] {
	const a = decode(expected);
	const b = decode(actual);
	const frames = Math.max(expected.frames, actual.frames);
	const diffs: ElementDiff[] = [];

	for (const key of new Set([...a.keys(), ...b.keys()])) {
		const before = a.get(key) ?? [];
		const after = b.get(key) ?? [];
		let diff: ElementDiff | undefined;
		for (let frame = 0; frame < frames; frame++) {
			const x = before[frame] ?? null;
			const y = after[frame] ?? null;
			let detail: string | undefined;
			if (x === null && y !== null) detail = "unexpectedly present";
			else if (x !== null && y === null) detail = "missing";
			else if (x !== null && y !== null) {
				const prop = Object.keys(x).find((p) => !same(p, x[p], y[p]));
				if (prop) detail = `${prop}: expected ${JSON.stringify(x[prop])}, got ${JSON.stringify(y[prop])}`;
			}
			if (!detail) continue;
			if (diff) {
				diff.last = frame;
				diff.count++;
			} else diffs.push((diff = { key, first: frame, last: frame, count: 1, detail }));
		}
	}
	return diffs.sort((x, y) => x.first - y.first);
}

function describe(diffs: ElementDiff[], times: number[]): string {
	const at = (frame: number) => `frame ${frame} (${times[frame]}ms)`;
	const lines = diffs
		.slice(0, 15)
		.map(
			(d) => `  ${d.key}: ${d.count} frame(s) differ, ${at(d.first)}..${at(d.last)}\n    first difference: ${d.detail}`
		);
	if (diffs.length > 15) lines.push(`  ...and ${diffs.length - 15} more element(s)`);
	return `${diffs.length} element(s) moved differently from the baseline:\n${lines.join("\n")}`;
}

/**
 * Compares `trace` with the committed baseline `baselines/<platform>/<name>.json`. Missing baselines are written;
 * `--update-snapshots` overwrites changed ones.
 */
export async function expectTrace(trace: Trace, name: string, testInfo: TestInfo) {
	const file = join(BASELINES_DIR, `${name}.json`);
	const body = serialize(trace);
	const mode = testInfo.config.updateSnapshots;
	const write = (reason: string) => {
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, body);
		testInfo.annotations.push({ type: "baseline", description: `${reason}: ${file}` });
	};

	if (!existsSync(file)) {
		if (mode === "none") throw new Error(`Missing baseline ${file}`);
		return write("written");
	}
	const diffs = compareTraces(JSON.parse(readFileSync(file, "utf8")), trace);
	if (!diffs.length) return;
	if (mode === "all" || mode === "changed") return write("updated");

	await testInfo.attach("actual-trace.json", { body, contentType: "application/json" });
	throw new Error(describe(diffs, trace.times));
}
