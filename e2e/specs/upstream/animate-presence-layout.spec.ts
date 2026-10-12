import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence", () => {
	test("Ensures all elements are removed", async ({ page }) => {
		await visit(page, "?test=animate-presence-layout");
		await wait(page, 50);
		await trigger(page.locator("#inner"), "click", 1, 1);
		await wait(page, 100);
		await trigger(page.locator("#outer"), "click", 1, 1);
		await wait(page, 700);
		await should(async () => expect(await page.locator("#box").count()).toBe(0));
	});
});
