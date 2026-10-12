import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, visit, wait, type BoundingBox } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: BoundingBox) {
	const box = await bbox(element);
	expect(Math.round(box.left)).toBe(expectedBbox.left);
	expect(Math.round(box.top)).toBe(expectedBbox.top);
	expect(Math.round(box.width)).toBe(expectedBbox.width);
	expect(Math.round(box.height)).toBe(expectedBbox.height);
}

test.describe("Read initial transform during layout animation", () => {
	test("Should not read a projection transform as the initial transform", async ({ page }) => {
		await visit(page, "?test=layout-read-transform");
		await wait(page, 400);
		await should(() =>
			expectBbox(page.locator("#box"), {
				top: 0,
				left: 0,
				width: 200,
				height: 200,
			})
		);
	});
});
