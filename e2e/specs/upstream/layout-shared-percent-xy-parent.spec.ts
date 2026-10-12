import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Layout animation with percentage x/y parent (#3254)", () => {
	test("layoutId indicator animates to correct position within parent with percentage x/y", async ({ page }) => {
		await visit(page, "?test=layout-shared-percent-xy-parent");
		await wait(page, 200);
		await expect(page.locator("#indicator")).toBeAttached({ timeout: 4000 });
		// Click tab 2 to trigger layout animation
		await trigger(page.locator("#tab-2"), "click");
		await wait(page, 500);
		await should(async () => {
			const box = await bbox(page.locator("#indicator"));
			// With ease: () => 0.5 and duration: 10s, at any point during
			// the animation (which lasts 10s), progress is always 0.5.
			//
			// Parent is 300px wide with x: "25%" = 75px translate.
			// Tab 0 starts at 75px, tab 2 starts at 275px (75 + 200).
			// At 50% progress: 75 + (275-75)*0.5 = 175px.
			//
			// If the layout animation is broken due to the percentage x/y
			// parent, the indicator snaps to 275 (final position) instead.
			expect(box.left).toBeGreaterThan(100);
			expect(box.left).toBeLessThan(250);
		});
	});
});
