import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("Unit conversion", () => {
	test("animates height: auto correctly", async ({ page }) => {
		await visit(page, "?test=animate-height");
		await wait(page, 200);
		await should(async () => expect(await page.locator("#test").innerText()).not.toBe("Error"));
	});

	test("animates translation from px to percent", async ({ page }) => {
		await visit(page, "?test=animate-x-percent");
		await wait(page, 200);
		await should(async () => expect(await page.locator("#test").innerText()).not.toBe("Error"));
	});
});
