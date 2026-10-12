import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

const innerText = (locator: Locator) => locator.first().evaluate((el) => (el as HTMLElement).innerText);

test.describe("scroll ViewTimeline acceleration", () => {
	test("Accelerates target with default offset when ViewTimeline supported", async ({ page }) => {
		await visit(page, "?test=scroll-view-timeline");
		await wait(page, 200);
		await should(async () => {
			const expected = (await page.evaluate(() => !!(window as any).ViewTimeline)) ? "true" : "false";
			expect(await innerText(page.locator("#default-accelerate"))).toBe(expected);
		});
	});

	test("Accelerates target with Enter preset offset when ViewTimeline supported", async ({ page }) => {
		await visit(page, "?test=scroll-view-timeline");
		await wait(page, 200);
		await should(async () => {
			const expected = (await page.evaluate(() => !!(window as any).ViewTimeline)) ? "true" : "false";
			expect(await innerText(page.locator("#enter-accelerate"))).toBe(expected);
		});
	});

	test("Accelerates target with cover string offset when ViewTimeline supported", async ({ page }) => {
		await visit(page, "?test=scroll-view-timeline");
		await wait(page, 200);
		await should(async () => {
			const expected = (await page.evaluate(() => !!(window as any).ViewTimeline)) ? "true" : "false";
			expect(await innerText(page.locator("#string-accelerate"))).toBe(expected);
		});
	});
});
