import { expect, test } from "@playwright/test";
import { bbox, expectBbox, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Shared layout: Fragment", () => {
	test("Elements with layoutId inside a Fragment should animate from the correct starting position", async ({
		page,
	}) => {
		await visit(page, "?test=layout-shared-fragment");
		await wait(page, 50);
		await expectBbox(page.locator("#box"), { top: 100, left: 0, width: 100, height: 100 });
		await trigger(page.locator("#box"), "click");
		await wait(page, 200);
		await should(async () => {
			// At ease: () => 0.5, the element should be halfway
			// between top: 100 and top: 300, i.e. top: 200.
			// If the bug is present, it will start from top: 0
			// and be at top: 150 instead.
			const box = await bbox(page.locator("#box"));
			expect(box.top).toBe(200);
		});
	});
});
