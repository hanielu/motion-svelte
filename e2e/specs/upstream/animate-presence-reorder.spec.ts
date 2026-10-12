import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence reorder", () => {
	test("Correct number of animations trigger", async ({ page }) => {
		await visit(page, "?test=animate-presence-reorder");
		await wait(page, 50);
		await trigger(page.locator("#move"), "click", 10, 10);
		await wait(page, 300);
		await should(async () => {
			const items = await page.locator(".item").allTextContents();
			expect(items[0]).toBe("2");
			expect(items[1]).toBe("");
		});
	});
});
