import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("useScroll with target ref hydrated after useScroll's own effects", () => {
	test("Tracks the target element, not the whole window", async ({ page }) => {
		// Target sits 1000px below the top in a 2000px-tall page (500px
		// viewport). At scrollY=400 the target is still off-screen, so
		// progress must be ~0. If useScroll falls back to whole-window
		// tracking it settles at ~0.27; if the accelerated (ViewTimeline)
		// path mistracks a late-hydrated ref it settles at ~0.36.
		await visit(page, "?test=use-scroll-target-late-ref");
		await page.setViewportSize({ width: 100, height: 500 });

		// Wait for the nested ReactDOM root to mount. Assert exactly one
		// instance: if StrictMode's double-invoke leaves two <Repro> trees,
		// fail loudly here rather than silently reading the stale,
		// window-tracking one.
		await should(async () => expect(await page.locator("#target").count()).toBe(1));
		await should(async () => expect(await page.locator("#progress").count()).toBe(1));

		await page.evaluate(() => window.scrollTo(0, 400));

		// The buggy value does not appear immediately — useScroll starts at
		// 0 and only jumps to the wrong value once its (mis)attached scroll
		// timeline first reports. A bare `.should` would pass on that
		// initial 0 before the bug surfaces (the original false pass that
		// masked this on React 19). Let it settle, THEN assert; `.should`
		// still retries afterwards, so a correct 0 is caught immediately
		// and a regressed ~0.36/~0.27 fails for the full retry window.
		await wait(page, 1000);
		await should(async () => {
			const progress = await page.locator("#progress").evaluate((el) => (el as HTMLElement).innerText);
			expect(parseFloat(progress)).toBeLessThan(0.05);
		});
	});
});
