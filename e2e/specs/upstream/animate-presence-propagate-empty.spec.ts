import { expect, test } from "@playwright/test";
import { should, visit } from "../../harness/upstream.js";

test.describe("AnimatePresence propagate", () => {
	test("Completes exit when there are no children", async ({ page }) => {
		test.skip(
			true,
			"unsupported: AnimatePresence has no `propagate` prop; without it the fixture's empty inner AnimatePresence is inert, so the test would pass trivially"
		);
		await visit(page, "?test=animate-presence-propagate-empty");
		await page.locator("#toggle").click();
		await should(async () => expect(await page.locator("#section").count()).toBe(0));
		await should(async () => expect(await page.locator("#exit-complete-count").textContent()).toBe("1"));
	});
});
