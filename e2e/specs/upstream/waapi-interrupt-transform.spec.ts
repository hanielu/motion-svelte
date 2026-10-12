import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("useAnimate WAAPI interruption", () => {
	test("should not jump to origin when interrupting transform animation", async ({ page }) => {
		await visit(page, "?test=waapi-interrupt-transform");
		await wait(page, 2500);
		await should(async () => {
			const minOffset = parseInt((await page.locator("#result").textContent()) ?? "");
			// After animation starts (tracking begins at 500ms),
			// the element should never jump back near origin.
			// With 2s linear to 200px, even with 200ms resolver
			// delay, at 500ms the element is at ~30px.
			// A jump to origin would make minOffset ~0.
			expect(minOffset).toBeGreaterThan(15);
		});
	});
});
