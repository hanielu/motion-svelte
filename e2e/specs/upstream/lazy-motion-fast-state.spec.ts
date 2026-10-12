import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("LazyMotion with fast state changes", () => {
	test("animates when state changes before features load", async ({ page }) => {
		await visit(page, "?test=lazy-motion-fast-state");
		await wait(page, 300); // Wait for features to load and animation to complete
		await should(async () => {
			const { animationComplete, opacity } = await page.locator("#box").evaluate((el) => ({
				animationComplete: (el as HTMLElement).dataset.animationComplete,
				opacity: getComputedStyle(el).opacity,
			}));
			// Verify the animation completed
			expect(animationComplete).toBe("true");
			// Verify the element is visible (opacity: 1)
			expect(opacity).toBe("1");
		});
	});
});
