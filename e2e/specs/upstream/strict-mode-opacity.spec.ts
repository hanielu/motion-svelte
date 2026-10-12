import { expect, test, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("StrictMode opacity animation", () => {
	const opacityOf = (page: Page) =>
		page.locator("#box").evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));

	test("element starts at opacity 0 when using single 'to' value with autoplay: false", async ({ page }) => {
		await visit(page, "?test=strict-mode-opacity");
		await wait(page, 200);
		await should(async () => expect(await opacityOf(page)).toBe(0));
	});

	test("element animates to opacity 1 when triggered", async ({ page }) => {
		await visit(page, "?test=strict-mode-opacity");
		await wait(page, 200);
		await should(async () => expect(await opacityOf(page)).toBe(0));
		await page.locator("#trigger").click();
		await wait(page, 800);
		await should(async () => expect(await opacityOf(page)).toBe(1));
	});
});
