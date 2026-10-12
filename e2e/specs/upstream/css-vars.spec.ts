import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("CSS variables", () => {
	test("Numerical CSS var values are resolved and animated correctly", async ({ page }) => {
		await visit(page, "?test=css-vars");
		await wait(page, 100);
		await should(async () => expect(await page.locator("#test").textContent()).toBe("Success"));
	});
});
