import { expect, test, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/**
 * Test for issue #3562: Variant propagation lost for children that mount
 * asynchronously via React.lazy + Suspense.
 *
 * When a parent animates from "hidden" to "visible" and a child mounts
 * asynchronously (after the parent has already committed), the child should
 * still animate from its "hidden" variant rather than jumping directly to
 * its "visible" values.
 */
test.describe("Variant propagation to lazy-loaded Suspense children", () => {
	const opacityOf = (page: Page) =>
		page
			.locator("#child")
			.evaluate((el) => parseFloat((el as HTMLElement).style.opacity), undefined, { timeout: 2000 });

	test("child should animate from initial variant, not jump to animate values", async ({ page }) => {
		await visit(page, "?test=variant-propagation-suspense");
		// Wait for the lazy module to load and the child to mount
		// Check immediately after mount — opacity should be near 0,
		// not 1 (which would mean it skipped the animation)
		await should(async () => {
			const opacity = await opacityOf(page);
			// If the bug is present, opacity jumps straight to 1.
			// With the fix, opacity starts at 0 and animates up.
			expect(opacity).toBeLessThan(0.5);
		});
	});

	test("child should reach final animate variant values after animation completes", async ({ page }) => {
		await visit(page, "?test=variant-propagation-suspense");
		await expect(page.locator("#child")).toBeAttached({ timeout: 2000 });
		// After ~3s total (100ms load + 2s animation + buffer), should be at 1
		await wait(page, 3000);
		await should(async () => {
			const opacity = await opacityOf(page);
			expect(opacity).toBe(1);
		});
	});
});
