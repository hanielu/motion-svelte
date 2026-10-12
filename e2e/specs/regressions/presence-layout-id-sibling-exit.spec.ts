import { expect, test } from "@playwright/test";
import { trigger, visit, wait } from "../../harness/upstream.js";

test.describe("A layoutId element without exit inside AnimatePresence", () => {
	test("stays visible when a sibling branch exits", async ({ page }) => {
		const toggle = page.locator("#toggle");
		await visit(page, "?test=presence-layout-id-sibling-exit");
		await trigger(toggle, "click");
		await wait(page, 400);
		await trigger(toggle, "click");
		await wait(page, 400);

		const avatar = page.locator("#avatar");
		expect(await avatar.count()).toBe(1);
		expect(await avatar.evaluate((el) => getComputedStyle(el).visibility)).toBe("visible");
	});
});
