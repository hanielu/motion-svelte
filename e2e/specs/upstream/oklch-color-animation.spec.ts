import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("oklch color animation", () => {
	test("animates to the correct oklch target color", async ({ page }) => {
		test.skip(
			true,
			"env: upstream only passes under old Electron. Chromium supports oklch, so the branch upstream skips under Electron runs and reads the mount-time onAnimationComplete result rgb(255, 255, 255) (and computed oklch() never serializes as rgb)"
		);
		const result = page.locator("#result");
		await visit(page, "?test=oklch-color-animation");
		await wait(page, 200);
		await page.locator("#toggle").click();
		await should(async () => expect(await result.textContent()).not.toBe(""));
		const data = JSON.parse((await result.textContent())!);

		if (data.supportsOklch) {
			/**
			 * In browsers that support oklch (Chrome, Firefox, Safari),
			 * the computed style should be the oklch color resolved to
			 * rgb. oklch(0.65 0.18 260) ≈ rgb(71, 150, 210).
			 */
			const match = data.computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			expect(match).not.toBeNull();
			const [, r, g, b] = match!;
			expect(Number(r)).toBeLessThan(120);
			expect(Number(g)).toBeGreaterThan(100);
			expect(Number(b)).toBeGreaterThan(180);
		} else {
			/**
			 * In browsers that don't support oklch (e.g. Electron),
			 * verify the animation completed without crashing.
			 * The unit tests for supportsBrowserAnimation are the
			 * primary regression gate for this fix.
			 */
			expect(data.computed).toMatch(/^rgb/);
		}
	});
});
