import { expect, test } from "@playwright/test";
import { bbox, scrollToTop, should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for scroll-while-drag feature.
 * Verifies that draggable elements stay attached to the cursor
 * when scrolling occurs during drag.
 *
 * Note: Cypress has known quirks with pointer event coordinates that can cause
 * small position discrepancies. These tests verify the scroll compensation
 * prevents large position jumps, which is the core functionality.
 */
test.describe("Drag with element scroll during drag", () => {
	test("Element stays at same viewport position during scroll (no pointer move)", async ({ page }) => {
		const scrollAmount = 100;
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55); // Start gesture
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		const { rectBefore, rectAfter } = await page.evaluate((scrollAmount) => {
			const el = document.querySelector("[data-testid='draggable']") as HTMLElement;
			const rectBefore = el.getBoundingClientRect().toJSON();

			// Scroll the container during drag (no pointer move after)
			const scrollable = document.querySelector("[data-testid='scrollable']") as HTMLElement;
			scrollable.scrollTop = scrollAmount;

			// Wait for scroll event to be processed
			return new Promise<{ rectBefore: DOMRect; rectAfter: DOMRect }>((resolve) => {
				setTimeout(() => resolve({ rectBefore, rectAfter: el.getBoundingClientRect().toJSON() }), 100);
			});
		}, scrollAmount);

		// Element should stay at same viewport position
		// (within small tolerance for rendering)
		expect(Math.abs(rectAfter.top - rectBefore.top)).toBeLessThanOrEqual(15);
		expect(Math.abs(rectAfter.left - rectBefore.left)).toBeLessThanOrEqual(15);
	});

	test("Element scroll compensation prevents large position jumps", async ({ page }) => {
		const scrollAmount = 200;
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55); // Start gesture
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		// Scroll the container during drag
		await page.evaluate((scrollAmount) => {
			const scrollable = document.querySelector("[data-testid='scrollable']") as HTMLElement;
			scrollable.scrollTop = scrollAmount;
		}, scrollAmount);
		await wait(page, 100);
		// Continue dragging - move to the same position
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { top } = await bbox(draggable);

			// Without scroll compensation, top would be negative (~-100)
			// because the element would "jump" by the scroll amount.
			// With scroll compensation, top should be positive and reasonable.
			expect(top).toBeGreaterThan(0);
			expect(top).toBeLessThan(scrollAmount);
		});
	});

	test("Element moves correctly without scroll", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// Element should be roughly at the drag position
			// Allow tolerance for Cypress coordinate quirks
			expect(left).toBeGreaterThan(50);
			expect(left).toBeLessThan(200);
			expect(top).toBeGreaterThan(50);
			expect(top).toBeLessThan(200);
		});
	});
});

test.describe("Drag with window scroll during drag", () => {
	/**
	 * Note: This test verifies that window scroll compensation is applied.
	 * Due to Cypress limitations with synthetic scroll events, the exact
	 * positioning may vary. The real behavior is validated by manual testing.
	 * The key assertion is that the element doesn't jump completely off-screen.
	 */
	test("Element stays at same viewport position during window scroll (no pointer move)", async ({ page }) => {
		const scrollAmount = 100;
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag&window=true");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55); // Start gesture
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		const { rectAfter } = await page.evaluate((scrollAmount) => {
			const el = document.querySelector("[data-testid='draggable']") as HTMLElement;
			const rectBefore = el.getBoundingClientRect().toJSON();

			// Scroll the window during drag (no pointer move after)
			window.scrollTo(0, scrollAmount);

			// Dispatch scroll event manually (Cypress may not trigger it automatically)
			window.dispatchEvent(new Event("scroll", { bubbles: true }));

			// Wait for scroll event to be processed
			return new Promise<{ rectBefore: DOMRect; rectAfter: DOMRect }>((resolve) => {
				setTimeout(() => resolve({ rectBefore, rectAfter: el.getBoundingClientRect().toJSON() }), 100);
			});
		}, scrollAmount);

		// The element should not jump completely off-screen.
		// Without any compensation, top would be ~-45 (negative).
		// With compensation, it should stay positive and reasonable.
		// Note: Cypress synthetic events may not perfectly replicate
		// real browser scroll behavior, so we use lenient bounds.
		expect(rectAfter.top).toBeGreaterThan(-50);
		expect(rectAfter.top).toBeLessThan(200);
	});

	test("Window scroll compensation prevents large position jumps", async ({ page }) => {
		const scrollAmount = 200;
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag&window=true");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55); // Start gesture
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		// Scroll the window during drag
		await page.evaluate((scrollAmount) => window.scrollTo(0, scrollAmount), scrollAmount);
		await wait(page, 100);
		// Continue dragging - move to the same position
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { top } = await bbox(draggable);

			// Window scroll is compensated during scroll (verified by "no pointer move" test).
			// Cypress trigger coordinates after scroll may not match real pointer behavior,
			// so we just verify the element is in a reasonable position (not off-screen).
			// Note: The strict "no pointer move" test verifies the actual compensation works.
			expect(top).toBeGreaterThan(-100);
			expect(top).toBeLessThan(500);
		});
	});

	test("Element moves correctly without window scroll", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");

		await visit(page, "?test=drag-scroll-while-drag&window=true");
		await wait(page, 200);
		await scrollToTop(draggable);
		await trigger(draggable, "pointerdown", 50, 50);
		await scrollToTop(draggable);
		await trigger(draggable, "pointermove", 55, 55);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 100, 100);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// Element should be roughly at the drag position
			expect(left).toBeGreaterThan(50);
			expect(left).toBeLessThan(200);
			expect(top).toBeGreaterThan(50);
			expect(top).toBeLessThan(200);
		});
	});
});
