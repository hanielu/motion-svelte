import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/**
 * Test that motion values are reset to initial values after a React Suspense
 * unmount/remount cycle. Verifies the fix for issue #2269.
 *
 * Without the fix, scale gets stuck at an intermediate animation value
 * and opacity appears incorrectly reset after Suspense remount.
 *
 * Timeline of the test component:
 *   0ms   - Animation starts (opacity 0 → 1, scale 0.5 → 2, duration 10s)
 *   400ms - Component suspends
 *   900ms - Component resumes, values should reset to initial
 */
test.describe("Animation resume after Suspense", () => {
	test("resets values to initial after Suspense remount", async ({ page }) => {
		test.skip(true, "unsupported: Svelte has no <Suspense> that hides and later resumes a mounted subtree");
		await visit(page, "?test=suspense-animation-resume");
		await wait(page, 50);
		// Element should exist and be animating
		await expect(page.locator("#target")).toBeAttached();

		// Wait for suspend — fallback should appear
		await expect(page.locator("#fallback")).toBeAttached({ timeout: 2000 });
		await should(async () => expect(await page.locator("#fallback").textContent()).toContain("Suspended"));

		// Wait for resume — target should reappear
		await expect(page.locator("#target")).toBeAttached({ timeout: 2000 });
		await should(async () => {
			// Right after remount, opacity should be reset to initial (0),
			// not stuck at an intermediate value from before suspension.
			// Use getComputedStyle since the inline style may not be set yet.
			const opacity = parseFloat(await page.locator("#target").evaluate((el) => window.getComputedStyle(el).opacity));
			expect(opacity).toBeLessThan(0.3);
		});
	});
});
