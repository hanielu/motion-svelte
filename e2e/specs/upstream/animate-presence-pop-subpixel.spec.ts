import { expect, test } from "@playwright/test";
import { bbox, should, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence popLayout subpixel precision", () => {
	test("preserves sub-pixel width when popping layout", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: popped width is 400 instead of 400.39; popLayout sizes the popped element from integer offsetWidth/offsetHeight instead of computed width/height"
		);
		const child = page.locator("#child");
		await visit(page, "?test=animate-presence-pop-subpixel");
		await wait(page, 50);
		const initialWidth = (await bbox(child)).width;

		await page.locator("#toggle").click();
		await wait(page, 50);
		await should(async () => {
			const poppedWidth = (await bbox(child)).width;

			// After pop, width must match the original sub-pixel
			// value within 0.1px — not rounded to an integer.
			expect(Math.abs(poppedWidth - initialWidth)).toBeLessThanOrEqual(0.1);
		});
	});

	test("preserves width for content-box elements with padding and border", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: popped content-box element grows from 250 to 300; popLayout writes offsetWidth (border-box, 250) as the CSS width instead of the computed content width (200)"
		);
		const child = page.locator("#child");
		await visit(page, "?test=animate-presence-pop-subpixel&padding=true");
		await wait(page, 50);
		const initialWidth = (await bbox(child)).width;

		await page.locator("#toggle").click();
		await wait(page, 50);
		await should(async () => {
			const poppedWidth = (await bbox(child)).width;

			// content-box element with padding (20*2) and border (5*2).
			// Old code used offsetWidth (250) as CSS width, but
			// content-box width only controls the 200px content area,
			// so the element would grow by 50px.
			expect(Math.abs(poppedWidth - initialWidth)).toBeLessThanOrEqual(0.5);
		});
	});
});
