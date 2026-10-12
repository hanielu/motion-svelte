import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Unit conversion", () => {
	/**
	 * Test for GitHub issue #3410
	 * When animating from a calc() with CSS variables to a simple value (and back),
	 * the animation should complete correctly without getting stuck at intermediate values.
	 */
	test("Animate x roundtrip: 0 -> calc -> 0", async ({ page }) => {
		const box = page.locator("#box");
		// Helper to extract translateX value from computed transform matrix
		const getTranslateX = () =>
			box.evaluate((element) => {
				const style = window.getComputedStyle(element);
				const matrix = new DOMMatrix(style.transform);
				return matrix.m41; // translateX is in m41
			});
		const styleTransform = () => box.evaluate((element) => (element as HTMLElement).style.transform);

		await visit(page, "?test=unit-conversion&roundtrip=true");
		await wait(page, 200);
		await should(async () => {
			// Initial position should be 0
			expect(await getTranslateX()).toBe(0);
			// Initial style should be none or translateX(0px)
			expect(await styleTransform()).toMatch(/^(none|translateX\(0px\))$/);
		});
		// First click: 0 -> calc(3 * var(--width)) = 300px
		await trigger(box, "click");
		await should(async () => {
			// Computed position should be 300px
			expect(await getTranslateX()).toBe(300);
			// Style should preserve the calc expression
			expect(await styleTransform()).toBe("translateX(calc(3 * var(--width)))");
		});
		// Second click: calc(300px) -> 0
		await trigger(box, "click");
		await should(async () => {
			// Computed position should be back to 0
			expect(await getTranslateX()).toBe(0);
			// Style should be none (transform cleared when returning to default)
			expect(await styleTransform()).toBe("none");
		});
	});

	test("Animate x from 0 to calc", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=unit-conversion");
		await wait(page, 100);
		await trigger(box, "click");
		await should(async () => {
			const { left } = await bbox(box);
			expect(left).toBe(150);
		});
	});

	test("Animate x from 0 to calc with externally-defined motion value", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, "?test=unit-conversion&use-motion-value=true");
		await wait(page, 100);
		await trigger(box, "click");
		await should(async () => {
			const { left } = await bbox(box);
			expect(left).toBe(150);
		});
	});

	test("Animate width and height to/from vh units", async ({ page }) => {
		await page.setViewportSize({ width: 400, height: 400 });
		await visit(page, "?test=unit-conversion-vh");
		await wait(page, 100);
		await should(async () => {
			const { width, height } = await bbox(page.locator("#box"));
			expect(width).toBe(150);
			expect(height).toBe(150);
		});
	});

	test("Restores unapplied transforms", async ({ page }) => {
		const box = page.locator("#box");
		await page.setViewportSize({ width: 400, height: 400 });
		await visit(page, "?test=unit-conversion-rotate");
		await wait(page, 300);
		await should(async () => {
			const { transform, textContent } = await box.evaluate((el) => ({
				transform: (el as HTMLElement).style.transform,
				textContent: el.textContent,
			}));
			expect(transform).toBe("rotate(45deg)");
			expect(textContent).toBe("Success");
		});
	});

	test("Measures the used width, not the bounding box, on bordered elements", async ({ page }) => {
		const box = page.locator("#box");
		await page.setViewportSize({ width: 600, height: 400 });
		await visit(page, "?test=unit-conversion-border");
		await wait(page, 200);
		const { width, textContent } = await box.evaluate((el) => ({
			width: parseFloat(getComputedStyle(el).width),
			textContent: el.textContent,
		}));
		// 10s linear from 100px to 200px: barely moved after 200ms
		expect(width).toBeGreaterThan(99);
		expect(width).toBeLessThan(110);
		expect(textContent).toBe("Success");
	});

	test("Coerces none keyframes before measuring", async ({ page }) => {
		await page.setViewportSize({ width: 400, height: 400 });
		await visit(page, "?test=unit-conversion-to-zero");
		await wait(page, 100);
		await should(async () => {
			const { top } = await bbox(page.locator("#box"));
			expect(top).toBe(100);
		});
	});
});
