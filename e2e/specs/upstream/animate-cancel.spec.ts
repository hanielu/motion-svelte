import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("animation.cancel()", () => {
	test("Doesn't throw error on unmount", async ({ page }) => {
		await visit(page, "?test=animate-cancel");
		const box = page.locator(".box");
		await wait(page, 100);
		await should(async () => expect(await box.textContent()).not.toContain("error"));
	});
});
