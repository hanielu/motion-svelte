import { expect, test } from "@playwright/test";
import { should, visit } from "../../harness/upstream.js";

test.describe("animate() filter blur (#3102)", () => {
	test("animates filter blur values correctly including re-animation", async ({ page }) => {
		await visit(page, "?test=animate-filter-blur");

		// First animation should complete
		await should(async () => expect(await page.locator("#done").textContent()).toContain("true"));

		// Re-animation should also complete
		await should(async () => expect(await page.locator("#reanimated").textContent()).toContain("true"));

		// The box should have the correct final filter value
		await should(async () => {
			const filter = await page.locator("#box").evaluate((el) => getComputedStyle(el).filter);
			// After blur(0px) animation, filter should be "none" or "blur(0px)"
			expect(filter === "none" || filter === "blur(0px)").toBe(true);
		});
	});
});
