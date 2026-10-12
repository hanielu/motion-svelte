import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, visit, wait } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: { left: number }) {
	const box = await bbox(element);
	expect(Math.round(box.left)).toBe(expectedBbox.left);
}

test.describe("Layout animation: Instant layout undo", () => {
	test("Correctly cancels animation", async ({ page }) => {
		const box = page.locator("#box");
		await visit(page, `?test=layout-instant-undo`);
		await wait(page, 50);
		await should(() => expectBbox(box, { left: 200 }));
		await box.click();
		await wait(page, 50);
		await should(() => expectBbox(box, { left: 200 }));
	});
});
