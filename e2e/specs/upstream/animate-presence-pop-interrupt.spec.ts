import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence popLayout interrupt", () => {
	test("removes data-motion-pop-id when exit animation is interrupted", async ({ page }) => {
		const target = page.locator("#target");
		const hasPopId = () => target.evaluate((el) => el.hasAttribute("data-motion-pop-id"));
		await visit(page, "?test=animate-presence-pop-interrupt");
		await wait(page, 50);
		await should(async () => {
			// Initially no pop id
			expect(await hasPopId()).toBe(false);
			// Let the entry animation finish first. Exiting to opacity 0
			// before it has rendered has nothing to animate, so the
			// element would be removed immediately.
			expect(await target.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
		});
		// Click to start exit (long duration so it won't complete)
		await page.locator("#toggle").click();
		await wait(page, 200);
		// During exit, element should have pop id
		await should(async () => expect(await hasPopId()).toBe(true));
		// Click again to re-enter (interrupt the exit)
		await page.locator("#toggle").click();
		await wait(page, 200);
		// After re-entry, pop id must be removed
		await should(async () => expect(await hasPopId()).toBe(false));
	});
});
