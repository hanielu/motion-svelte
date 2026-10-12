import { expect, test } from "@playwright/test";
import { visit, wait } from "../../harness/upstream.js";

test.describe("Independent transforms", () => {
	test("animate from a stylesheet transform", async ({ page }) => {
		await visit(page, "?test=animate-transform-from-stylesheet");
		await wait(page, 5000);
		const m41 = await page
			.locator("#box")
			.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41);
		expect(m41).toBeGreaterThanOrEqual(135);
		expect(m41).toBeLessThanOrEqual(165);
	});
});
