import { expect, test } from "@playwright/test";
import { trigger, visit, wait } from "../../harness/upstream.js";

interface PresenceDataset {
	mounts: Record<string, number>;
	resetWidths: () => void;
	minWidth: () => number;
}

/**
 * Reproduction for #3746 — a key present in both datasets must not be treated
 * as freshly entering when the dataset is switched.
 *
 * The reported symptom is that on the *second* switch the persisting bar
 * "disappears and reappears, and its width animates from 0". We sample its
 * width every frame for the whole switch, so a collapse can't be missed
 * between assertions.
 */
test.describe("AnimatePresence dataset switch", () => {
	test("Never replays the enter animation for a persisting key", async ({ page }) => {
		await visit(page, "?test=animate-presence-strict-dataset");
		await wait(page, 700);
		// First switch A -> B, let it settle completely.
		await trigger(page.locator("#switch"), "click", 5, 5);
		await wait(page, 700);
		// Start sampling fresh, then perform the second switch.
		await page.evaluate(() =>
			(window as unknown as { presenceDataset: PresenceDataset }).presenceDataset.resetWidths()
		);
		await trigger(page.locator("#switch"), "click", 5, 5);
		await wait(page, 700);
		const { minWidth, persistMounts } = await page.evaluate(() => {
			const { presenceDataset } = window as unknown as { presenceDataset: PresenceDataset };
			return { minWidth: presenceDataset.minWidth(), persistMounts: presenceDataset.mounts.persist };
		});
		// The bar goes from 240 -> 200. It must never dip towards 0.
		expect(minWidth).toBeGreaterThan(150);
		// And it must never have re-mounted. StrictMode double-invokes
		// effects on mount, so a bar that mounts once reports 2.
		expect(persistMounts).toBe(2);
	});
});
