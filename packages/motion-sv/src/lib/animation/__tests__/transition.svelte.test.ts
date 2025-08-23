import { describe, it, expect } from "vitest";
import { motionExit } from "../transition.svelte.js";

function createNode(initial: Partial<CSSStyleDeclaration> = {}) {
	const style: any = {
		getPropertyValue: (name: string) => (style as any)[name],
		...initial,
	};
	const node: any = {
		style,
		addEventListener: (_type: string, _cb: any) => {},
		removeEventListener: (_type: string, _cb: any) => {},
	};
	// minimal getComputedStyle shim used by styleUtils.get
	(globalThis as any).getComputedStyle = () => style;
	return node as Element;
}

describe("motionExit transition adapter", () => {
	it("interpolates rotate from current to target", () => {
		const node = createNode();
		const t = motionExit(node, {
			definition: { rotate: 0, transition: { duration: 0.2 } },
			from: { rotate: 45 },
			get allowIntro() {
				return true;
			},
			set allowIntro(_v: boolean) {},
		});
		const css = (t as any).css as (t: number, u: number) => string;
		// outro path uses u for progress; u=0 => from, u=1 => to
		const mid = css(0, 0.5);
		expect(mid).toContain("rotate(");
		// ensure not snapping to 0 instantly
		const start = css(0, 0);
		const end = css(0, 1);
		expect(start).toContain("rotate(45");
		expect(end).toContain("rotate(0");
	});

	it("interpolates scale and translate with units", () => {
		const node = createNode();
		const t = motionExit(node, {
			definition: { scale: 0.5, x: 20, transition: { duration: 0.2 } },
			from: { scale: 1, x: 0 },
			get allowIntro() {
				return true;
			},
			set allowIntro(_v: boolean) {},
		});
		const css = (t as any).css as (t: number, u: number) => string;
		const mid = css(0, 0.5);
		expect(mid).toContain("transform:");
		expect(mid).toContain("scale(");
		expect(mid).toMatch(/translate(3d|X|Y)?\(/);
	});
});
