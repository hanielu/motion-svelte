import { expect, test, type Locator } from "@playwright/test";
import { bbox, nextFrame, should, trigger, visit, wait, triggerInView } from "../../harness/upstream.js";

test.describe("Drag with rotated parent", () => {
	test("Element follows cursor when parent is rotated 180deg", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no transformPagePoint and correctParentTransform is not exported");
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-rotated-parent");
		await wait(page, 200);
		await wait(page, 100);
		await nextFrame(page);
		await nextFrame(page);
		await triggerInView(draggable, "pointerdown", 50, 50);
		await triggerInView(draggable, "pointermove", 55, 55); // Past threshold
		await nextFrame(page);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 150, 50); // Move right
		await nextFrame(page);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left } = await bbox(draggable);
			// Element starts at left=300 (child at top-left of 400x400
			// container rotated 180deg around center)
			// Cursor moved right, so element should also move right
			// Without fix (bug): left ≈ 205 (moves opposite to cursor)
			// With fix: left ≈ 405 (follows cursor)
			expect(left).toBeGreaterThan(350);
		});
	});
});
