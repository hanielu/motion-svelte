import { expect, test } from "@playwright/test";
import { visit, wait } from "../../harness/upstream.js";

test.describe("height: auto with border-box", () => {
	test("animates to correct target height when box-sizing is border-box with padding", async ({ page }) => {
		await visit(page, "?test=animate-height-border-box");
		// Sample at 50% of a 10s linear animation (0 → target).
		// Correct target is 140px (border-box: 100 content + 40 padding),
		// so midpoint ≈ 70px. Bug target was 100px, midpoint ≈ 50px.
		await wait(page, 5000);
		const height = parseFloat(await page.locator("#box").evaluate((el) => getComputedStyle(el).height));
		expect(height).toBeGreaterThan(60);
	});
});
