import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Drag + dragSnapToOrigin + AnimatePresence exit interaction (companion
 * to #3315). After the fix removed VE.unmount's synchronous value.stop(),
 * we want to confirm that:
 *   1. AnimatePresence exit animations still complete and tear the tile down.
 *   2. Toggling the tile back on after a drag yields a clean motion element
 *      (no stranded drag transform from the previous instance).
 */
test.describe("drag + dragSnapToOrigin + AnimatePresence exit", () => {
	test("exits cleanly after a drag and re-enters without a stranded transform", async ({ page }) => {
		const tile = page.locator('[data-testid="tile"]');
		const toggle = page.locator('[data-testid="toggle"]');
		await visit(page, "?test=drag-snap-animate-presence-exit");
		await wait(page, 200);
		// Capture the tile's initial layout box so we can compare the
		// re-entered instance to it later.
		const initial = await bbox(tile);
		// Drag the tile and release — dragSnapToOrigin animation kicks in.
		await trigger(tile, "pointerdown", 10, 10);
		await trigger(tile, "pointermove", 20, 10);
		await wait(page, 50);
		await trigger(tile, "pointermove", 60, 10);
		await wait(page, 50);
		await trigger(tile, "pointerup", 60, 10);
		// Toggle off mid-snap to trigger AnimatePresence exit while
		// the drag motion-value animation is still in flight.
		await toggle.click();
		await wait(page, 800);
		// AnimatePresence should have torn the tile down.
		await should(async () => expect(await tile.count()).toBe(0));
		// Toggle back on and confirm the new tile renders at the
		// same layout position as the first instance — no leftover
		// transform from the previous drag.
		await toggle.click();
		await wait(page, 500);
		await should(async () => {
			const r = await bbox(tile);
			expect(Math.abs(r.left - initial.left)).toBeLessThanOrEqual(2);
			expect(Math.abs(r.top - initial.top)).toBeLessThanOrEqual(2);
		});
	});
});
