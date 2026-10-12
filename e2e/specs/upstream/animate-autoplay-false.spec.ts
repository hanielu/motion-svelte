import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("animate() with autoplay: false", () => {
	test("does not start WAAPI animation when autoplay is false", async ({ page }) => {
		await visit(page, "?test=animate-autoplay-false");
		await wait(page, 200);
		await should(async () => {
			// opacity should remain at 1 since autoplay is false
			const opacity = parseFloat(await page.locator("#box").evaluate((el) => getComputedStyle(el).opacity));
			expect(opacity).toBe(1);
		});
	});
});
