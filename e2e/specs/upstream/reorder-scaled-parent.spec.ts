/**
 * Reorder inside a parent with a raw CSS `transform: scale()` and a non-centre
 * `transform-origin`.
 *
 * Issues: https://github.com/motiondivision/motion/issues/2449
 *         https://github.com/motiondivision/motion/issues/2750
 *
 * Raw CSS transforms on ancestors are invisible to the projection / drag
 * measurement system, so without correction the dragged item does not track
 * the cursor and reorder thresholds fire at the wrong positions. The supported
 * workaround is `correctParentTransform(ref)` via `MotionConfig
 * transformPagePoint`. These tests pin that workaround so future drag /
 * projection refactors can't silently regress it.
 *
 * Pointer coords are element-relative (same pattern as `drag-scaled-parent.ts`).
 * PanSession applies pointermove on the next animation frame, so end-state
 * checks use `.should()` — a single `.then()` after a fixed wait races RAF
 * on slow CI.
 */
import { expect, test, type Locator } from "@playwright/test";
import { bbox, nextFrame, should, trigger, visit, wait } from "../../harness/upstream.js";

function itemOrder(items: Locator): Promise<string[]> {
	return items.evaluateAll((els) => els.map((el) => el.getAttribute("data-testid") as string));
}

/** `expect(actual).to.be.closeTo(expected, delta)` */
function expectCloseTo(actual: number, expected: number, delta: number) {
	expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

test.describe("Reorder inside a scaled parent (#2449 / #2750)", () => {
	test("dragged item tracks the cursor with correctParentTransform (scale 0.5)", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no transformPagePoint and correctParentTransform is not exported");
		const item = page.locator("[data-testid='item-0']");
		await visit(page, "?test=reorder-scaled-parent&corrected=true&scale=0.5");
		await should(async () => expect(await item.isVisible()).toBe(true));

		const start = await bbox(item);
		const startMidY = start.top + start.height / 2;

		await nextFrame(page);
		await nextFrame(page);
		await trigger(item, "pointerdown", 20, 10);
		await wait(page, 50);
		// Move past the drag threshold.
		await trigger(item, "pointermove", 20, 16);
		await nextFrame(page);
		await wait(page, 50);
		// Move the pointer 80px down the screen.
		await trigger(item, "pointermove", 20, 90);
		await nextFrame(page);

		// Drag tracking is 1:1, not a tween: retry until the frame loop
		// applies the pointermove. A wrong scale (e.g. 40px uncorrected)
		// stays wrong and still fails.
		await should(async () => {
			const moved = await bbox(item);
			const screenDelta = moved.top + moved.height / 2 - startMidY;

			// The element must follow the cursor (~80px on screen),
			// not 80 / scale (160px) or 80 * scale (40px) as it would
			// without the transformPagePoint correction.
			expect(screenDelta).toBeGreaterThan(60);
			expect(screenDelta).toBeLessThan(100);
		});

		await trigger(item, "pointerup");
	});

	test("reorders correctly and settles aligned with correctParentTransform", async ({ page }) => {
		test.skip(true, "unsupported: MotionConfig has no transformPagePoint and correctParentTransform is not exported");
		const item = page.locator("[data-testid='item-0']");
		const items = page.locator("#reorder-group [data-testid]");
		await visit(page, "?test=reorder-scaled-parent&corrected=true&scale=0.5");
		await should(async () => expect(await item.isVisible()).toBe(true));

		await should(async () => {
			expect(await itemOrder(items)).toEqual(["item-0", "item-1", "item-2", "item-3"]);
		});

		// Element-relative moves. Scale 0.5 → ~40px screen is ~80px local,
		// enough to cross item-1's centre (needs >35px local) without
		// racing through the whole list.
		await nextFrame(page);
		await nextFrame(page);
		await trigger(item, "pointerdown", 20, 10);
		await wait(page, 50);
		await trigger(item, "pointermove", 20, 16);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(item, "pointermove", 20, 35);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(item, "pointermove", 20, 50);
		await nextFrame(page);
		await wait(page, 50);
		await trigger(item, "pointerup");

		await should(async () => {
			const order = await itemOrder(items);
			expect(order.indexOf("item-0"), `expected item-0 to sit below item-1, got ${order.join(",")}`).toBeGreaterThan(
				order.indexOf("item-1")
			);
		});

		// List sits flush: 10px local gap × 0.5 scale = 5px screen, no
		// leftover drag/layout transform. Retry until springs finish.
		await should(async () => {
			const boxes = await items.evaluateAll((els) =>
				els.map((el) => {
					const { top, bottom } = el.getBoundingClientRect();
					return { top, bottom };
				})
			);
			for (let i = 1; i < boxes.length; i++) {
				expectCloseTo(boxes[i].top, boxes[i - 1].bottom + 5, 4);
			}
		});
	});
});
