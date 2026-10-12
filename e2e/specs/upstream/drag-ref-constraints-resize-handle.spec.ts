import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for issue #2903: Drag constraints should update when the
 * draggable element is resized via a path that bypasses React state
 * (e.g. CSS `resize: both` or imperative DOM resizing — the scenario
 * described in the linked CodeSandbox).
 *
 * - Container (#constraints): 500x500
 * - Draggable (#box): starts 100x100, grows to 300x300 when
 *   #resize-trigger is clicked. The handler mutates the element's
 *   inline style directly so the only signal of the size change is
 *   ResizeObserver — projection's normal lifecycle does not fire.
 *
 * Before resize: max travel = 400px (500 - 100)
 * After resize:  max travel = 200px (500 - 300)
 */
test.describe("Drag Constraints Update on Imperative Resize", () => {
	test("Updates drag constraints when element grows via direct DOM mutation", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: bind:ref dragConstraints never applied (right 900 vs <=502); with a plain-div ref it still keeps the pre-resize 400px travel (no ResizeObserver)"
		);
		const box = page.locator("#box");
		await visit(page, "?test=drag-ref-constraints-resize-handle");
		await wait(page, 200);

		await page.locator("#resize-trigger").click();
		await wait(page, 200);

		await should(async () => {
			const { width, height } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			expect(width).toBe(300);
			expect(height).toBe(300);
		});

		await trigger(box, "pointerdown", 5, 5);
		await trigger(box, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(box, "pointermove", 600, 600);
		await wait(page, 50);
		await trigger(box, "pointerup");
		await wait(page, 50);
		await should(async () => {
			const { right, bottom } = await box.evaluate((el) => el.getBoundingClientRect().toJSON());
			// 300x300 box must stay inside the 500x500 container.
			// Without the fix, right/bottom would be ~700.
			expect(right).toBeLessThanOrEqual(502);
			expect(bottom).toBeLessThanOrEqual(502);
		});
	});
});
