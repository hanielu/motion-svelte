import { expect, test } from "@playwright/test";
import { nextFrame, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Reorder grid", () => {
	test("auto-detects a grid and reorders across both axes", async ({ page }) => {
		const a = page.locator("[data-testid='a']");
		await visit(page, "?test=reorder-grid");
		await wait(page, 200);

		await nextFrame(page);
		await nextFrame(page);
		await trigger(a, "pointerdown", 50, 50);
		await wait(page, 50);
		await trigger(a, "pointermove", 60, 60);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(a, "pointermove", 160, 160);
		await nextFrame(page);
		await wait(page, 100);

		expect(await page.locator("[data-testid='current-order']").textContent()).toBe("b,c,d,a");

		await trigger(a, "pointerup", 160, 160);
	});
});
