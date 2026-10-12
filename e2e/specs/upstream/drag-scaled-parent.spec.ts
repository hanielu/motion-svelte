import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait, triggerInView } from "../../harness/upstream.js";

test.describe("Drag with scaled parent", () => {
	test("Element follows cursor when parent has scale(0.5)", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no transformPagePoint and correctParentTransform is not exported");
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-scaled-parent");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 10, 10);
		await triggerInView(draggable, "pointermove", 15, 15); // Past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 110, 110);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// Parent has scale(0.5) with transformOrigin: top left
			// Element starts at (0,0) in parent space, which renders at (0,0) on screen
			// After dragging to pointermove(110,110) from pointerdown(10,10),
			// the screen delta is 100px.
			// The element should follow the cursor, so its rendered position
			// should be near the pointer position.
			// Without fix: left ≈ 50 (half of expected, because translate(100)
			// in a scale(0.5) parent renders as 50px)
			// With fix: left ≈ 100 (element follows cursor)
			expect(left).toBeGreaterThan(80);
			expect(left).toBeLessThan(120);
			expect(top).toBeGreaterThan(80);
			expect(top).toBeLessThan(120);
		});
	});

	test("Element follows cursor when parent has scale(2)", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no transformPagePoint and correctParentTransform is not exported");
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-scaled-parent&scale=2");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 10, 10);
		await triggerInView(draggable, "pointermove", 15, 15); // Past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 110, 110);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// Parent has scale(2) with transformOrigin: top left
			// Screen delta is 100px.
			// Without fix: left ≈ 200 (double, because translate(100)
			// in a scale(2) parent renders as 200px)
			// With fix: left ≈ 100 (element follows cursor)
			expect(left).toBeGreaterThan(80);
			expect(left).toBeLessThan(120);
			expect(top).toBeGreaterThan(80);
			expect(top).toBeLessThan(120);
		});
	});
});
