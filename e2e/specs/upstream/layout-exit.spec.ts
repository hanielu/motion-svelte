import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("Layout exit animations", () => {
	test("Allows the animation to be marked complete", async ({ page }) => {
		await visit(page, "?test=layout-exit");
		await wait(page, 500);
		await should(async () => expect(await page.locator("#box").count()).toBe(0));
	});
});
