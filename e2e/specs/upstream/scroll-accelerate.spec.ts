import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

const innerText = (locator: Locator) => locator.first().evaluate((el) => (el as HTMLElement).innerText);

test.describe("scroll timeline WAAPI acceleration", () => {
	test("Propagates acceleration for direct useTransform from scroll", async ({ page }) => {
		await visit(page, "?test=scroll-accelerate");
		await wait(page, 200);
		await should(async () => {
			const expected = (await page.evaluate(() => !!(window as any).ScrollTimeline)) ? "true" : "false";
			expect(await innerText(page.locator("#direct-accelerated"))).toBe(expected);
		});
	});

	test("Propagates acceleration for non-acceleratable properties too", async ({ page }) => {
		await visit(page, "?test=scroll-accelerate");
		await wait(page, 200);
		await should(async () => {
			// backgroundColor gets accelerate config propagated,
			// but VisualElement skips WAAPI creation since it's
			// not in the acceleratedValues set
			const expected = (await page.evaluate(() => !!(window as any).ScrollTimeline)) ? "true" : "false";
			expect(await innerText(page.locator("#bg-accelerated"))).toBe(expected);
		});
	});

	test("Does not propagate acceleration for chained useTransform", async ({ page }) => {
		await visit(page, "?test=scroll-accelerate");
		await wait(page, 200);
		await should(async () => {
			expect(await innerText(page.locator("#chained-accelerated"))).toBe("false");
		});
	});
});
