import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Regression test for issue #3315.
 *
 * Tiles use `drag` + `dragSnapToOrigin` + `layoutId` in an absolutely-positioned grid. When same-row tiles swap,
 * the dragSnapToOrigin animation must survive the swap so the tile doesn't render at "new layout + stranded drag
 * offset".
 */
test.describe("drag + dragSnapToOrigin + layoutId horizontal swap", () => {
	test("does not strand the drag transform after a same-row swap", async ({ page }) => {
		const tile0 = page.locator('[data-testid="tile-0"]');
		const tile1 = page.locator('[data-testid="tile-1"]');
		await visit(page, "?test=drag-snap-layout-id-swap");
		await wait(page, 200);
		await should(async () => {
			const r = await bbox(tile0);
			expect(Math.abs(r.left - 50)).toBeLessThanOrEqual(2);
			expect(Math.abs(r.top - 50)).toBeLessThanOrEqual(2);
		});
		// Drag tile-0 right ~60px (one column) onto tile-1's slot.
		// Pointermoves are element-relative; we keep the move small so
		// the recomputed-as-element-moves coordinate system still lands
		// the pointer on tile-1.
		await trigger(tile0, "pointerdown", 5, 5);
		await trigger(tile0, "pointermove", 10, 5);
		await wait(page, 50);
		await trigger(tile0, "pointermove", 35, 5);
		await wait(page, 50);
		await trigger(tile0, "pointerup", 35, 5);
		await wait(page, 2000);
		await should(async () => {
			// Confirm the state-level swap happened.
			expect(await page.locator("#grid").getAttribute("data-tile-state")).toMatch(/^1,0,/);
		});
		await should(async () => {
			const r = await bbox(tile0);
			// Tile 0 swapped into column 1: 50 (padding) + 60 (column).
			// The bug would leave it at ~170 (col 1 + stranded drag).
			expect(Math.abs(r.left - 110)).toBeLessThanOrEqual(2);
			expect(Math.abs(r.top - 50)).toBeLessThanOrEqual(2);
		});
		await should(async () => {
			const r = await bbox(tile1);
			expect(Math.abs(r.left - 50)).toBeLessThanOrEqual(2);
			expect(Math.abs(r.top - 50)).toBeLessThanOrEqual(2);
		});
	});
});
