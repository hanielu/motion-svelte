import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("animate() sequence with spring defaultTransition (#3158)", () => {
	test("does not throw when using type: spring with 2-keyframe sequence segments", async ({ page }) => {
		await visit(page, "?test=animate-sequence-spring");
		await wait(page, 2000);
		await should(async () => expect(await page.locator("#result").inputValue()).toBe("Success"));
	});
});
