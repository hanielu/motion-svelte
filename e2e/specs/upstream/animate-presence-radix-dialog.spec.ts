import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/** `.should("exist")` / `.should("not.exist")` */
const exists = (target: Locator) => should(async () => expect(await target.count()).toBeGreaterThan(0));
const notExists = (target: Locator) => should(async () => expect(await target.count()).toBe(0));

test.describe("AnimatePresence with Radix UI Dialog", () => {
	test("Exit animations work correctly with Radix Dialog asChild", async ({ page }) => {
		test.skip(
			true,
			"unsupported: Radix UI Dialog (asChild callback-ref churn, #3455) is React-only; fixture approximates it with plain elements"
		);
		await visit(page, "?test=animate-presence-radix-dialog");
		await wait(page, 100);
		// Open the dialog
		await page.locator("#trigger").click();
		await wait(page, 500);
		// Verify dialog is open
		await exists(page.locator("#dialog"));
		await exists(page.locator("#overlay"));
		// Close the dialog
		await page.locator("#close").click();
		// Wait for exit animation to complete
		await wait(page, 600);
		// Verify exit animation completed (onExitComplete was called)
		await should(async () => expect(await page.locator("#exit-complete").getAttribute("data-value")).toBe("true"));
		// Verify the dialog elements are removed from DOM after exit
		await notExists(page.locator("#dialog"));
		await notExists(page.locator("#overlay"));
	});

	test("Exit animation actually runs (not immediately removed)", async ({ page }) => {
		test.skip(
			true,
			"unsupported: Radix UI Dialog (asChild callback-ref churn, #3455) is React-only; fixture approximates it with plain elements"
		);
		await visit(page, "?test=animate-presence-radix-dialog");
		await wait(page, 100);
		// Open the dialog
		await page.locator("#trigger").click();
		await wait(page, 500);
		// Verify dialog is open
		await exists(page.locator("#overlay"));
		// Close the dialog
		await page.locator("#close").click();
		// Check immediately - overlay should still exist during exit animation
		await exists(page.locator("#overlay"));
		// Wait a small amount for animation to start but not complete
		await wait(page, 100);
		// Overlay should still be animating out
		await exists(page.locator("#overlay"));
		// Now wait for full animation
		await wait(page, 400);
		// Now it should be gone
		await notExists(page.locator("#overlay"));
	});
});
