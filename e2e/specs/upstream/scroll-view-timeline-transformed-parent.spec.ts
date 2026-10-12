// Regression for #3658. The ViewTimeline assertion only runs in browsers
// that support ViewTimeline — CI's Electron does not, so it falls back
// to the JS path and there's nothing to assert against.
import { expect, test, type Page } from "@playwright/test";
import { visit, wait } from "../../harness/upstream.js";

const scrollToPx = (page: Page, px: number) => page.evaluate((px) => window.scrollTo(0, px), px);

const readWaapi = (page: Page) =>
	page.locator("#opacity-probe").evaluate((el) => parseFloat(getComputedStyle(el).opacity));

const readJs = (page: Page) => page.locator("#js-progress").evaluate((el) => parseFloat((el as HTMLElement).innerText));

test.describe("useScroll + transformed ancestor (regression for #3658)", () => {
	test("attaches ViewTimeline (not ScrollTimeline) to inner motion components", async ({ page }) => {
		await visit(page, "?test=scroll-view-timeline-transformed-parent");
		await wait(page, 500);
		test.skip(!(await page.evaluate(() => !!(window as any).ViewTimeline)));
		const animation = await page.locator("#opacity-probe").evaluate((el) => {
			const anims = el.getAnimations() as any[];
			const a = anims[0];
			return {
				length: anims.length,
				timeline: a?.timeline?.constructor?.name,
				rangeStart: a?.rangeStart?.rangeName,
				rangeEnd: a?.rangeEnd?.rangeName,
			};
		});
		expect(animation.length).toBeGreaterThan(0);
		expect(animation.timeline).toBe("ViewTimeline");
		expect(animation.rangeStart).toBe("contain");
		expect(animation.rangeEnd).toBe("contain");
	});

	test("WAAPI and JS paths agree on the same target across the scroll range", async ({ page }) => {
		await visit(page, "?test=scroll-view-timeline-transformed-parent");
		await wait(page, 500);

		const vh = await page.evaluate(() => window.innerHeight);
		const stops = [0.5, 1, 1.25, 1.5, 1.75, 2].map((m) => m * vh);
		const drift: number[] = [];

		for (const y of stops) {
			await scrollToPx(page, y);
			await wait(page, 200);
			const w = await readWaapi(page);
			const j = await readJs(page);
			drift.push(Math.abs(w - j));
		}

		expect(Math.max(...drift)).toBeLessThan(0.01);
	});
});
