import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Test for issue #3169: Drag + layout + React 19 StrictMode
 *
 * Simulates Ant Design Tree behavior:
 * 1. Memoized file components (don't re-render on parent state changes)
 * 2. Layout changes above the dragged element (folder expansion)
 *
 * The projection system must compensate even when the dragged file's
 * willUpdate() was never called because the component didn't re-render.
 */
test.describe("Drag layout reorder in StrictMode", () => {
	test("Maintains drag position when content is inserted above (memoized component)", async ({ page }) => {
		const file1 = page.locator("[data-testid='file-File1']");
		await visit(page, "?test=drag-layout-reorder-strict");
		await wait(page, 200);
		// Start dragging File1 downward
		await trigger(file1, "pointerdown", 100, 15);
		await wait(page, 50);
		await trigger(file1, "pointermove", 100, 20);
		await wait(page, 50);
		// Drag down slightly
		await trigger(file1, "pointermove", 100, 80);
		await wait(page, 200);
		// Record position before expanding Folder1
		const preExpandTop = (await bbox(file1)).top;

		// Expand Folder1 — this inserts 3 items (~105px total)
		// ABOVE the dragged file, shifting it down in the DOM
		await page.evaluate(() => (window as any).expandFolder("Folder1"));
		await wait(page, 500);

		// Verify expansion happened
		await should(async () =>
			expect(await page.locator("[data-testid='placeholder-Existing1a']").count()).toBeGreaterThan(0)
		);

		// The dragged file MUST stay near its pre-expand position.
		// Without the fix, the file would jump down by ~105px
		// because the memoized component's willUpdate() is never
		// called, so the projection system has no snapshot and
		// skips drag compensation.
		await should(async () => {
			const postExpandTop = (await bbox(file1)).top;
			expect(
				postExpandTop >= preExpandTop - 50 && postExpandTop <= preExpandTop + 50,
				`File1 jumped from ${preExpandTop} to ${postExpandTop} after folder expand`
			).toBe(true);
		});
		// Release drag
		await trigger(file1, "pointerup");
	});

	test("Maintains drag position on simple hover state change", async ({ page }) => {
		const file1 = page.locator("[data-testid='file-File1']");
		await visit(page, "?test=drag-layout-reorder-strict");
		await wait(page, 200);
		await trigger(file1, "pointerdown", 100, 15);
		await wait(page, 50);
		await trigger(file1, "pointermove", 100, 20);
		await wait(page, 50);
		await trigger(file1, "pointermove", 100, 80);
		await wait(page, 200);
		const preHoverTop = (await bbox(file1)).top;

		// Trigger hover state change (re-renders layout siblings)
		await page.evaluate(() => (window as any).hoverFolder("Folder3"));
		await wait(page, 300);

		await should(async () => expect(await page.locator("#result").getAttribute("data-hovered")).toBe("Folder3"));

		await should(async () => {
			const postHoverTop = (await bbox(file1)).top;
			expect(
				postHoverTop >= preHoverTop - 30 && postHoverTop <= preHoverTop + 30,
				`File1 jumped from ${preHoverTop} to ${postHoverTop} after folder hover`
			).toBe(true);
		});
		await trigger(file1, "pointerup");
	});
});
