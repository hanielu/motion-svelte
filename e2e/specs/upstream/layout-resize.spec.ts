import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: BoundingBox) {
	const box = await bbox(element);
	expect(Math.round(box.left)).toBe(expectedBbox.left);
	expect(Math.round(box.top)).toBe(expectedBbox.top);
	expect(Math.round(box.width)).toBe(expectedBbox.width);
	expect(Math.round(box.height)).toBe(expectedBbox.height);
}

test.describe("Resize window", () => {
	test("Finishes the animation and blocks animation on immediate layout animations until 250ms", async ({ page }) => {
		const box = page.locator("#box");
		const child = page.locator("#child");
		await visit(page, "?test=layout-resize");
		await wait(page, 50);
		await should(() => expectBbox(box, { top: 0, left: 0, width: 100, height: 100 }));
		await should(() => expectBbox(child, { top: 0, left: 0, width: 100, height: 100 }));
		await trigger(box, "click");
		await wait(page, 50);
		await page.setViewportSize({ width: 200, height: 200 });
		await wait(page, 100);
		await should(() => expectBbox(box, { top: 100, left: 100, width: 400, height: 200 }));
		await should(() => expectBbox(child, { top: 100, left: 100, width: 100, height: 100 }));
		await trigger(box, "click");
		await wait(page, 50);
		await should(() => expectBbox(box, { top: 0, left: 0, width: 100, height: 100 }));
		await should(() => expectBbox(child, { top: 0, left: 0, width: 100, height: 100 }));
		await wait(page, 200);
		await trigger(box, "click");
		await wait(page, 300);
		await should(async () => {
			const box_ = await bbox(box);
			expect(Math.round(box_.top)).not.toBe(0);
			expect(Math.round(box_.top)).not.toBe(100);
		});
	});
});
