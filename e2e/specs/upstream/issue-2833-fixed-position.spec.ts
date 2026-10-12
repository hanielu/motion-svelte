import { expect, test } from "@playwright/test";
import { bbox, visit } from "../../harness/upstream.js";

/**
 * Regression test for #2833.
 *
 * React-select with menuPosition="fixed" was rendering in the wrong position
 * because motion.div applied will-change: transform automatically, which
 * establishes a CSS containing block for position: fixed descendants. The
 * auto will-change behaviour was removed but plain transform/filter/etc.
 * should also never be applied by default.
 */
const variants = ["plain", "while-hover", "while-tap", "animate-transform", "initial-transform"];

test.describe("position: fixed children inside motion.div (#2833)", () => {
	for (const variant of variants) {
		test(`motion.div does not establish a containing block (variant=${variant})`, async ({ page }) => {
			await visit(page, `?test=issue-2833-fixed-position&variant=${variant}`);

			const cs = await page.locator("#parent").evaluate((el) => {
				const { transform, perspective, filter, willChange } = getComputedStyle(el);
				return { transform, perspective, filter, willChange };
			});
			expect(cs.transform).toBe("none");
			expect(cs.perspective).toBe("none");
			expect(cs.filter).toBe("none");
			// willChange of "transform"/"perspective"/"filter" would also
			// establish a containing block.
			expect(cs.willChange).toBe("auto");

			// The fixed-positioned child should land at viewport (10, 10),
			// not offset by the wrapper's 200px padding.
			const rect = await bbox(page.locator("#fixed-child"));
			expect(rect.top).toBe(10);
			expect(rect.left).toBe(10);
		});
	}
});
