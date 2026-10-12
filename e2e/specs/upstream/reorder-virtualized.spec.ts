import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Reorder with virtualized list (@tanstack/react-virtual)", () => {
	test("Preserves all items after reorder", async ({ page }) => {
		const item1 = page.locator("#Item-1");
		await visit(page, "?test=reorder-virtualized");
		await wait(page, 200);
		// Verify initial state — 50 items, only a subset visible
		await should(async () => expect(await page.locator("#item-count").getAttribute("data-count")).toBe("50"));
		const visible = parseInt((await page.locator("#visible-count").getAttribute("data-count"))!);
		expect(visible).toBeLessThan(50);
		expect(visible).toBeGreaterThan(0);
		// Drag Item 1 down past Item 2
		await trigger(item1, "pointerdown", 50, 25);
		await wait(page, 50);
		await trigger(item1, "pointermove", 50, 30);
		await wait(page, 50);
		await trigger(item1, "pointermove", 50, 55);
		await wait(page, 100);
		await trigger(item1, "pointerup", 50, 55);
		await wait(page, 200);
		// After reorder: all 50 items must still be present
		await should(async () => expect(await page.locator("#item-count").getAttribute("data-count")).toBe("50"));
		const order: string[] = JSON.parse((await page.locator("#item-order").getAttribute("data-order"))!);
		// All 50 items still present — none lost to virtualization
		expect(order).toHaveLength(50);
		const sorted = [...order].sort();
		const expected = Array.from({ length: 50 }, (_, i) => `Item ${i}`).sort();
		expect(sorted).toEqual(expected);
		// Item 1 is no longer at index 1 (it was dragged)
		expect(order[1]).not.toBe("Item 1");
		// Unmeasured items at the end are still there
		expect(order).toContain("Item 49");
	});
});
