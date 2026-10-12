import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: BoundingBox) {
	const box = await bbox(element);
	expect(Math.round(box.left)).toBe(expectedBbox.left);
	expect(Math.round(box.top)).toBe(expectedBbox.top);
	expect(Math.round(box.width)).toBe(expectedBbox.width);
	expect(Math.round(box.height)).toBe(expectedBbox.height);
}

test.describe("Relative projection targets: Delay", () => {
	test("Child correctly follows parent", async ({ page }) => {
		const parent = page.locator("#parent");
		const child = page.locator("#child");
		await visit(page, `?test=layout-relative-delay`);
		await wait(page, 50);
		await should(() => expectBbox(parent, { top: 0, left: 0, width: 200, height: 200 }));
		await should(() => expectBbox(child, { top: 0, left: 0, width: 100, height: 100 }));
		await trigger(parent, "click");
		await wait(page, 50);
		await should(() => expectBbox(parent, { top: 100, left: 100, width: 300, height: 200 }));
		await should(() => expectBbox(child, { top: 100, left: 100, width: 100, height: 100 }));
	});
});
