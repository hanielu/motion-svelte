import { expect, test, type Page } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

/**
 * scroll() and useScroll() with an offset and no target apply the offset on
 * every path. With a 1000px viewport the page scrolls 4000px, and the offset
 * ["1000px", "2000px"] maps 1000–2000px of scroll onto the animations.
 *
 * In browsers with ScrollTimeline, #box and the accelerated #use-scroll-box
 * could run natively, while #js-box always runs on the JS path.
 */
const getX = (transform: string) => (transform === "none" ? 0 : parseFloat(transform.split(",")[4]));

const expectProgress = (page: Page, id: string, progress: number) =>
	should(async () => {
		const style = await page.locator(id).evaluate((el) => {
			const { transform, opacity } = getComputedStyle(el);
			return { transform, opacity };
		});
		const value = id === "#js-box" ? getX(style.transform) / 100 : +style.opacity;
		expect(Math.abs(value - progress)).toBeLessThanOrEqual(0.05);
	});

test.describe("scroll() offset without a target", () => {
	test("Applies the offset to native, JS and useScroll values alike", async ({ page }) => {
		await page.setViewportSize({ width: 1000, height: 1000 });
		await visit(page, "?test=scroll-page-offset");
		await wait(page, 200);

		for (const [y, progress] of [
			[500, 0],
			[1500, 0.5],
			[2500, 1],
			[1500, 0.5],
			[500, 0],
		]) {
			await page.evaluate((y) => window.scrollTo(0, y), y);
			await wait(page, 200);
			await expectProgress(page, "#box", progress);
			await expectProgress(page, "#js-box", progress);
			await expectProgress(page, "#use-scroll-box", progress);
		}
	});
});
