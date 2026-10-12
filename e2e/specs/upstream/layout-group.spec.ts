import { expect, test, type Page } from "@playwright/test";
import { bbox, visit, wait } from "../../harness/upstream.js";

const buttonTop = async (page: Page) => Math.round((await bbox(page.locator("#button"))).top);

test.describe(`LayoutGroup inherit="id"`, () => {
	test("relative children should not instantly jump to new layout", async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		// Measure initial position
		const initialTop = await buttonTop(page);

		// Click expander
		await page.locator("#expander").click();

		// Measure position after 100ms
		await wait(page, 100);
		const top100ms = await buttonTop(page);
		// Should not be in original or final position
		expect(top100ms).not.toBe(104);
		expect(top100ms).not.toBe(initialTop);

		// Measure position after another 200ms for animation to finish
		await wait(page, 200);
		const top200ms = await buttonTop(page);
		expect(top200ms).toBe(104);
		expect(top200ms).not.toBe(initialTop);
		expect(top200ms).not.toBe(top100ms);
	});

	test("relative children should not instantly jump to new layout, after performing their own layout animation", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		// Click button first, then wait 50ms
		await page.locator("#button").click();
		await wait(page, 50);

		// Measure initial position
		const initialTop = await buttonTop(page);

		// Click expander
		await wait(page, 300);
		await page.locator("#expander").click();

		// Measure position after 100ms
		await wait(page, 100);
		const top100ms = await buttonTop(page);

		// Don't be in final or original position
		expect(top100ms).not.toBe(204);
		expect(top100ms).not.toBe(initialTop);

		// Measure position after another 100ms (200ms total)
		await wait(page, 200);
		const top200ms = await buttonTop(page);
		// Should not be in either previous measurement
		expect(top200ms).toBe(204);
		expect(top200ms).not.toBe(initialTop);
		expect(top200ms).not.toBe(top100ms);
	});

	test("should return to original state when expander is clicked twice with delay", async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		// Measure initial position
		const initialTop = await buttonTop(page);

		// Click expander
		await page.locator("#expander").click();

		// Measure position after 100ms
		await wait(page, 100);
		const top100ms = await buttonTop(page);
		// Should not be in original or final position
		expect(top100ms).not.toBe(104);
		expect(top100ms).not.toBe(initialTop);

		// Wait 50ms, then click expander again
		await wait(page, 50);
		await page.locator("#expander").click();

		// Measure position after animation finishes
		await wait(page, 300);
		const finalTop = await buttonTop(page);
		// Should be back to original state
		expect(finalTop).toBe(initialTop);
	});
});
