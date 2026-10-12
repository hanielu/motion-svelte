import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("animate() x layout prop timing", () => {
	test("animate() plays as expected when layout prop is present", async ({ page }) => {
		await visit(page, "?test=animate-layout-timing");
		await wait(page, 1000);
		await trigger(page.locator("#action"), "click", 1, 1);
		await wait(page, 600);
		await should(async () => expect(await page.locator("#result").inputValue()).toBe("Success"));
	});
});
