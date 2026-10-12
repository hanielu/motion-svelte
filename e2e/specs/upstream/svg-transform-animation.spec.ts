import { expect, test, type Locator } from "@playwright/test";
import { should, visit, wait } from "../../harness/upstream.js";

const transformOf = (target: Locator) => target.evaluate((el) => (el as SVGElement).style.transform);

test.describe("SVG transform animation (#3081)", () => {
	test("Applies transform animation without other SVG attributes animated", async ({ page }) => {
		await visit(page, "?test=svg-transform-animation");
		await wait(page, 50);
		await should(async () => {
			// Before animation, transform should be the initial matrix(2,0,0,2,0,0)
			expect(await transformOf(page.locator("#svg-rect"))).toContain("matrix");
		});
		await page.locator("#animate").click();
		await wait(page, 300);
		await should(async () => {
			const transform = await transformOf(page.locator("#svg-rect"));
			// After animation, transform should be the final identity matrix
			expect(transform).not.toBe("");
			expect(transform).not.toBe("none");
			expect(transform).toContain("matrix");
			const match = transform.match(/matrix\(([^)]+)\)/);
			expect(match).not.toBeNull();
			const values = match![1].split(",").map(Number);
			// Identity matrix: 1, 0, 0, 1, 0, 0
			expect(Math.abs(values[0] - 1)).toBeLessThanOrEqual(0.1);
			expect(Math.abs(values[3] - 1)).toBeLessThanOrEqual(0.1);
		});
		await should(async () => {
			const transform = await transformOf(page.locator("#svg-g"));
			expect(transform).not.toBe("");
			expect(transform).not.toBe("none");
			expect(transform).toContain("matrix");
		});
		await should(async () => {
			const transform = await transformOf(page.locator("#svg-root"));
			// motion.svg treats transforms like HTML (rotate builds to "none" at 0deg)
			expect(transform).not.toBe("");
		});
	});
});
