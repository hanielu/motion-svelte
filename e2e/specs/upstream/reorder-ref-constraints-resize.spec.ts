import { expect, test, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/**
 * Items are 80px wide with an 8px right margin inside a list with 8px
 * padding, so item i is laid out at left = 8 + i * 88.
 */
const items = ["one", "two", "three", "four", "five"];

async function expectItemsAtOrigin(page: Page, width: number) {
	await page.setViewportSize({ width, height: 660 });
	await wait(page, 200);
	for (const [i, item] of items.entries()) {
		const { left, zIndex } = await page.locator(`#${item}`).evaluate((el) => ({
			left: el.getBoundingClientRect().left,
			zIndex: getComputedStyle(el).zIndex,
		}));
		const label = `${item} at ${width}px`;
		expect(left, label).toBe(8 + i * 88);
		expect(zIndex, label).toBe("auto");
	}
}

test.describe("Reorder.Item with ref dragConstraints", () => {
	test("Items at their origin stay there when the window resizes", async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 660 });
		await visit(page, "?test=reorder-ref-constraints-resize");
		await wait(page, 200);
		await expectItemsAtOrigin(page, 1200);
		await expectItemsAtOrigin(page, 500);
		await expectItemsAtOrigin(page, 1000);
	});

	test("Clicking an item after a resize selects that item", async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 660 });
		await visit(page, "?test=reorder-ref-constraints-resize");
		await wait(page, 200);
		await page.setViewportSize({ width: 500, height: 660 });
		await wait(page, 200);

		// Click the centre of where "four" is laid out
		await page.locator("body").click({ position: { x: 8 + 3 * 88 + 40, y: 28 } });
		await should(async () => expect(await page.locator("#selected").textContent()).toBe("four"));
	});
});
