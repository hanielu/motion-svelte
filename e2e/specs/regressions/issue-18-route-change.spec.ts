import { expect, test } from "@playwright/test";
import { trigger, visit, wait } from "../../harness/upstream.js";

// https://github.com/hanielu/motion-svelte/issues/18
test.describe("AnimatePresence inside a destroyed route", () => {
	test("leaves immediately instead of waiting for its children's exit animations", async ({ page }) => {
		await visit(page, "?test=issue-18-route-change");
		await wait(page, 50);
		await trigger(page.locator("#navigate"), "click");
		await wait(page, 50);
		// The children's exit takes 300ms; the old page must already be gone, and the new one in its place.
		expect(await page.locator("#page-a").count()).toBe(0);
		expect(await page.locator("#page-b").evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(100);
	});

	test("still animates exits of its own children", async ({ page }) => {
		const label = page.locator("#label");
		await visit(page, "?test=issue-18-route-change");
		await wait(page, 50);
		await trigger(page.locator("#toggle"), "click");
		await wait(page, 100);
		expect(await label.count()).toBe(1);
		expect(Number(await label.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
		await wait(page, 500);
		expect(await label.count()).toBe(0);
	});
});
