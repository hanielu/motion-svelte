import { expect, test, type Locator } from "@playwright/test";
import {
	bbox,
	nextFrame,
	should,
	trigger,
	visit,
	wait,
	type BoundingBox,
	triggerInView,
} from "../../harness/upstream.js";

/** Upstream's local `expectBbox`: checks left/top, and width/height only when given. */
async function expectBbox(element: Locator, expectedBbox: Partial<BoundingBox>) {
	const box = await bbox(element);
	expect(box.left).toBe(expectedBbox.left);
	expect(box.top).toBe(expectedBbox.top);
	expectedBbox.width && expect(box.width).toBe(expectedBbox.width);
	expectedBbox.height && expect(box.height).toBe(expectedBbox.height);
}

test.describe("Nested Scroll/Page", () => {
	test("correctly positions children after dragging", async ({ page }) => {
		const a = page.locator("#a");
		await visit(page, "?test=drag-framer-page");
		await wait(page, 50);
		await should(async () => {
			await expectBbox(a, {
				top: 400,
				left: 110,
			});
		});
		await nextFrame(page);
		await nextFrame(page);
		await trigger(a, "pointerdown", 60, 60);
		await trigger(a, "pointermove", 50, 50); // Gesture will start from first move past threshold
		await nextFrame(page);
		await wait(page, 50);
		await trigger(a, "pointermove", 10, 10);
		await nextFrame(page);
		await wait(page, 200);
		await triggerInView(a, "pointerup");
		await wait(page, 70);
		await should(async () => {
			await expectBbox(a, {
				top: 400,
				left: 50,
			});
		});
		await trigger(page.locator("#b"), "pointerdown", 60, 60);
		await wait(page, 50);
		await should(async () => {
			await expectBbox(a, {
				top: 400,
				left: 50,
			});
		});
	});
});
