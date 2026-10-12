import { expect, test } from "@playwright/test";
import { visit, wait } from "../../harness/upstream.js";

test.describe("Values without a base value", () => {
	test("never write undefined or NaN SVG attributes", async ({ page }) => {
		// Cypress' `onBeforeLoad`
		await page.addInitScript(() => {
			const points: string[] = [];
			(window as unknown as { points: string[] }).points = points;
			const setAttribute = window.Element.prototype.setAttribute;
			window.Element.prototype.setAttribute = function (name: string, value: string) {
				if (name === "points") points.push(String(value));
				return setAttribute.call(this, name, value);
			};
		});
		await visit(page, "?test=animate-unresolved-origin");
		await wait(page, 1000);
		const points = await page.evaluate(() => (window as unknown as { points: string[] }).points);
		expect(points.length).toBeGreaterThan(2);
		points.forEach((value) => expect(value).not.toMatch(/NaN|undefined/u));
	});

	test("animate CSS variables from their inherited value", async ({ page }) => {
		await visit(page, "?test=animate-unresolved-origin");
		await wait(page, 5000);
		const x = await page
			.locator("#css-var")
			.evaluate((element) => parseFloat(getComputedStyle(element).getPropertyValue("--x")));
		expect(x).toBeGreaterThanOrEqual(65);
		expect(x).toBeLessThanOrEqual(85);
	});
});
