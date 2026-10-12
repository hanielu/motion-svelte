import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence mode=wait: key changes as the exit completes", () => {
	test("renders the latest child", async ({ page }) => {
		await visit(page, "?test=animate-presence-wait-exit-key-change");
		await wait(page, 100);
		await page.locator("#next").click();
		await should(async () => expect(await page.locator("#state").textContent()).toBe("2"));
		await expect(async () => {
			const children = await page
				.locator(".child")
				.evaluateAll((elements) => elements.map((el) => ({ id: el.id, opacity: getComputedStyle(el).opacity })));
			expect(children.length).toBe(1);
			expect(children[0].id).toBe("child-2");
			expect(children[0].opacity).toBe("1");
		}).toPass({ timeout: 2000, intervals: [16] });
	});
});
