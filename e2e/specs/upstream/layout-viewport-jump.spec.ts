import { expect, test, type Locator } from "@playwright/test";
import { bbox, scrollToTop, should, trigger, visit, wait } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: { top: number; width: number; height: number }) {
	const box = await bbox(element);
	expect(Math.floor(box.top)).toBe(expectedBbox.top);
	expect(Math.floor(box.width)).toBe(expectedBbox.width);
	expect(Math.floor(box.height)).toBe(expectedBbox.height);
}

test.describe("Viewport jump", () => {
	test("If viewport jumps, don't trigger layout animation", async ({ page }) => {
		const box = page.locator("#box");
		await page.setViewportSize({ width: 1000, height: 600 });
		await visit(page, "?test=layout-viewport-jump");
		await wait(page, 50);
		await should(() => expectBbox(box, { height: 100, top: 100, width: 100 }));
		await page.evaluate(() => window.scrollTo(0, 100));
		await should(() => expectBbox(box, { height: 100, top: 0, width: 100 }));
		await scrollToTop(box);
		await trigger(box, "click");
		await wait(page, 50);
		await should(() => expectBbox(box, { height: 100, top: 100, width: 100 }));
	});

	/**
	 * This passes locally but can't get it to pass in Cypress
	 */
	test("If div scroll jumps, don't trigger layout animation if provided layoutScroll prop", async ({ page }) => {
		const box = page.locator("#box");
		await page.setViewportSize({ width: 1000, height: 600 });
		await visit(page, "?test=layout-viewport-jump&nested=true");
		await wait(page, 50);
		await should(() => expectBbox(box, { height: 100, top: 100, width: 100 }));
		await page.locator("#scrollable").evaluate((el) => el.scrollTo(0, 100));
		await should(() => expectBbox(box, { height: 100, top: 0, width: 100 }));
		await scrollToTop(box);
		await trigger(box, "click");
		await wait(page, 50);
		await should(() => expectBbox(box, { height: 100, top: 100, width: 100 }));
	});
});
