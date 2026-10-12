/**
 * Tests for Reorder auto-scroll feature.
 * Verifies that when dragging a reorder item near the edge of a scrollable
 * container, the container automatically scrolls.
 */
import { expect, test } from "@playwright/test";
import { scrollToTop, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Reorder auto-scroll", () => {
	test.describe("with scrollable container", () => {
		test("Auto-scrolls down when dragging near bottom edge", async ({ page }) => {
			test.fail(
				true,
				"motion-sv: ReorderItem ignores `as` and renders <div> not <li>, so the li styles (60px tall) never apply and the list never overflows"
			);
			const container = page.locator("[data-testid='scroll-container']");
			const item = page.locator("[data-testid='0']");
			await visit(page, "?test=reorder-auto-scroll");
			await wait(page, 200);
			expect(await container.evaluate((el) => el.scrollTop)).toBe(0);

			const containerRect = await container.evaluate((el) => el.getBoundingClientRect().toJSON());
			const nearBottom = containerRect.bottom - containerRect.top - 20;

			await scrollToTop(item);
			await trigger(item, "pointerdown", 50, 25);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, 30);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, nearBottom);
			await wait(page, 300);
			expect(await container.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
			await trigger(item, "pointerup");
		});

		test("Auto-scrolls up when dragging near top edge", async ({ page }) => {
			test.fail(
				true,
				"motion-sv: ReorderItem ignores `as` and renders <div> not <li>, so the li styles (60px tall) never apply and the list never overflows"
			);
			const container = page.locator("[data-testid='scroll-container']");
			const item = page.locator("[data-testid='8']");
			await visit(page, "?test=reorder-auto-scroll");
			await wait(page, 200);
			await container.evaluate((el) => (el.scrollTop = 200));
			await wait(page, 100);
			await should(async () => expect(await container.evaluate((el) => el.scrollTop)).toBe(200));
			await scrollToTop(item);
			await trigger(item, "pointerdown", 50, 25);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, 20);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, -100);
			await wait(page, 300);
			expect(await container.evaluate((el) => el.scrollTop)).toBeLessThan(200);
			await trigger(item, "pointerup");
		});
	});

	test.describe("with scrollable container inside scrollable page", () => {
		test("Auto-scrolls container after page has been scrolled", async ({ page }) => {
			test.fail(
				true,
				"motion-sv: ReorderItem ignores `as` and renders <div> not <li>, so the li styles (60px tall) never apply and the list never overflows"
			);
			const container = page.locator("[data-testid='scroll-container']");
			const item = page.locator("[data-testid='0']");
			await visit(page, "?test=reorder-auto-scroll-container");
			await wait(page, 200);
			// Scroll the page down so the container is in view
			await page.evaluate(() => window.scrollTo(0, 200));
			await wait(page, 100);
			expect(await container.evaluate((el) => el.scrollTop)).toBe(0);

			const containerRect = await container.evaluate((el) => el.getBoundingClientRect().toJSON());
			const nearBottom = containerRect.bottom - containerRect.top - 20;

			await scrollToTop(item);
			await trigger(item, "pointerdown", 50, 25);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, 30);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, nearBottom);
			await wait(page, 300);
			expect(await container.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
			await trigger(item, "pointerup");
		});
	});

	test.describe("without scrollable container inside scrollable page", () => {
		test("Auto-scrolls page after dragging near the edges", async ({ page }) => {
			const item = page.locator("[data-testid='0']");
			await visit(page, "?test=reorder-auto-scroll-page");
			await wait(page, 200);
			// Check window position, then scroll
			expect(await page.evaluate(() => window.scrollY)).toBe(0);
			await wait(page, 100);

			const nearBottom = await page.evaluate(() => window.innerHeight - window.screenTop - 20);

			await scrollToTop(item);
			await trigger(item, "pointerdown", 50, 25);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, 30);
			await wait(page, 50);
			await trigger(item, "pointermove", 50, nearBottom);
			await wait(page, 300);
			expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
			await trigger(item, "pointerup");
		});
	});
});
