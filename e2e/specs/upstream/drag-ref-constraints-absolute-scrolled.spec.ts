import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for issue #2829: Drag with ref-based constraints on a viewport-sized
 * element (`position: absolute; inset: 0`) should allow dragging to the bottom
 * of the visible viewport, even when the page is loaded with scroll restored.
 *
 * The test page scrolls the window in a layout effect before drag is wired up,
 * mimicking the browser restoring scroll position on refresh.
 */
test.describe("Drag with ref constraints on absolute element after scroll", () => {
	test("Allows dragging to the visible bottom of the viewport after scroll", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await page.setViewportSize({ width: 1000, height: 800 });
		await visit(page, "?test=drag-ref-constraints-absolute-scrolled&scroll=300");
		await wait(page, 300);
		expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
		await trigger(draggable, "pointerdown", 5, 5);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 900, 1500);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 100);
		await should(async () => {
			const rect = await draggable.evaluate((el) => el.getBoundingClientRect().toJSON());
			// viewport: 1000x800, scroll: 300, box: 50x50
			// Constraint is `position: absolute; inset: 0` (viewport-sized
			// at the document origin). After the page is loaded scrolled,
			// the visible portion of the constraint spans viewport y ∈
			// [0, 500]. Before the fix, drag constraints were computed
			// with a stale scroll offset, clamping the box's bottom to
			// ~200 (= viewportH - 2*scrollY - boxH). With the fix, the
			// box should reach the constraint's visible bottom (~500).
			expect(Math.abs(rect.bottom - 500)).toBeLessThanOrEqual(5);
		});
	});
});
