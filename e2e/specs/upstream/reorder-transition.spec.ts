/**
 * Reorder.Group must not call onReorder again with the same order while the
 * previous order is still pending (onReorder in a transition, or values from
 * useDeferredValue). Unrelated commits used to clear its guard, causing
 * duplicate calls and, with deferred values on React 19, a render loop of
 * one onReorder per pointermove.
 */
import { expect, test } from "@playwright/test";
import { visit } from "../../harness/upstream.js";

test.describe("Reorder with non-urgent order updates", () => {
	for (const mode of ["useTransition", "deferred"]) {
		test(`calls onReorder once per new order (${mode})`, async ({ page }) => {
			test.skip(
				true,
				"unsupported: React concurrent rendering (startTransition, useTransition, useDeferredValue); Svelte applies state changes synchronously"
			);
			await visit(page, `?test=reorder-transition&mode=${mode}`);
			await page.locator("#drag").click();
			await expect(async () => expect(await page.evaluate(() => (window as any).dragDone)).toBe(true)).toPass({
				timeout: 10000,
				intervals: [16],
			});
			const calls: string[] = await page.evaluate(() => (window as any).reorderCalls);
			expect(calls.length).toBeGreaterThan(0);
			// The drag crosses at most 3 rows.
			expect(calls.length).toBeLessThanOrEqual(3);
			for (let i = 1; i < calls.length; i++) {
				expect(calls[i]).not.toBe(calls[i - 1]);
			}
		});
	}
});
