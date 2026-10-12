import { expect, test } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

test.describe("LazyMotion with m components from /m subpath (issue #3091)", () => {
	test("animates m.div from framer-motion/m inside LazyMotion from framer-motion", async ({ page }) => {
		await visit(page, "?test=lazy-motion-react-m-subpath");
		await wait(page, 500);
		await should(async () => {
			const { animationFailed, animationComplete, opacity } = await page.locator("#box").evaluate((el) => ({
				animationFailed: (el as HTMLElement).dataset.animationFailed,
				animationComplete: (el as HTMLElement).dataset.animationComplete,
				opacity: getComputedStyle(el).opacity,
			}));
			expect(animationFailed).not.toBe("true");
			expect(animationComplete).toBe("true");
			expect(opacity).toBe("1");
		});
	});
});
