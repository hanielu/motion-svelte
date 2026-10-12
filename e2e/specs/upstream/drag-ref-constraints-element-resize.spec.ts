import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for issue #2458: Drag constraints should update when the
 * draggable element or constraint container resizes.
 *
 * The test page has:
 * - Container (#constraints): 500x500
 * - Draggable (#box): starts 100x100, resizable to 300x300 via button
 *
 * Before resize: max travel = 400px (500 - 100)
 * After resize: max travel = 200px (500 - 300)
 */
test.describe("Drag Constraints Update on Element Resize", () => {
	test("Constrains drag correctly before resize", async ({ page }) => {
		test.fail(true, "motion-sv: a parent motion.div's bind:ref passed as dragConstraints is never applied, so the box drags unconstrained (right 700 vs <=502)");
		const box = page.locator("#box");
		await visit(page, "?test=drag-ref-constraints-element-resize");
		await wait(page, 200);
		await trigger(box, "pointerdown", 5, 5);
		await trigger(box, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(box, "pointermove", 600, 600);
		await wait(page, 50);
		await trigger(box, "pointerup");
		await wait(page, 50);
		await should(async () => {
			const { right, bottom } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			// 100x100 box in 500x500 container: max right/bottom = 500
			expect(right).toBeLessThanOrEqual(502);
			expect(bottom).toBeLessThanOrEqual(502);
		});
	});

	test("Updates drag constraints after draggable element is resized", async ({ page }) => {
		test.fail(true, "motion-sv: bind:ref dragConstraints never applied (right 900 vs <=502); with a plain-div ref it still keeps the pre-resize 400px travel (no ResizeObserver)");
		const box = page.locator("#box");
		await visit(page, "?test=drag-ref-constraints-element-resize");
		await wait(page, 200);

		// Click resize button to resize draggable from 100x100 to 300x300
		await page.locator("#resize-trigger").click();
		await wait(page, 200);

		// Verify the box is now 300x300
		await should(async () => {
			const { width, height } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			expect(width).toBe(300);
			expect(height).toBe(300);
		});

		// Now drag to the far bottom-right
		await trigger(box, "pointerdown", 5, 5);
		await trigger(box, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(box, "pointermove", 600, 600);
		await wait(page, 50);
		await trigger(box, "pointerup");
		await wait(page, 50);
		await should(async () => {
			const { right, bottom } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			// 300x300 box in 500x500 container: max right/bottom = 500
			// Without the fix, right/bottom would be ~700 (300 + 400 old constraint)
			expect(right).toBeLessThanOrEqual(502);
			expect(bottom).toBeLessThanOrEqual(502);
		});
	});

	test("Updates drag constraints after draggable element is resized, with existing drag offset", async ({ page }) => {
		test.fail(true, "motion-sv: bind:ref dragConstraints never applied (right 1000 vs <=502); with a plain-div ref it still keeps the pre-resize 400px travel (no ResizeObserver)");
		const box = page.locator("#box");
		await visit(page, "?test=drag-ref-constraints-element-resize");
		await wait(page, 200);

		// First drag to an intermediate position
		await trigger(box, "pointerdown", 5, 5);
		await trigger(box, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(box, "pointermove", 100, 100);
		await wait(page, 50);
		await trigger(box, "pointerup");
		await wait(page, 50);

		// Resize the element from 100x100 to 300x300
		await page.locator("#resize-trigger").click();
		await wait(page, 200);

		// Now drag far to the bottom-right
		await trigger(box, "pointerdown", 5, 5);
		await trigger(box, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(box, "pointermove", 600, 600);
		await wait(page, 50);
		await trigger(box, "pointerup");
		await wait(page, 50);
		await should(async () => {
			const { right, bottom } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			// Even after a prior drag + resize, box must stay within container
			expect(right).toBeLessThanOrEqual(502);
			expect(bottom).toBeLessThanOrEqual(502);
		});
	});
});
