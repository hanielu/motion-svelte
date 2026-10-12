import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence exit no-op (#3078)", () => {
	test("Removes modal when child exit targets match current values", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-no-op");
		await wait(page, 200);
		await page.locator("#toggle").click();
		await wait(page, 200);

		// Modal should be visible
		await should(async () => expect(await page.locator("#modal").count()).toBeGreaterThan(0));

		// Wait for enter animations to complete
		await wait(page, 2000);

		// Close the modal via the cancel button
		await page.locator("#cancel").click();

		// Modal should be removed promptly. The bug was that
		// value.isAnimating (property access, always truthy) prevented
		// the skip check from working, so exit animations targeting the
		// same values as the current state were never skipped.
		await wait(page, 1000);
		await should(async () => expect(await page.locator("#modal").count()).toBe(0));
	});
});
