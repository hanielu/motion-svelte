import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("AnimatePresence popLayout RTL", () => {
	test("correctly pops exiting elements in RTL direction without shifting", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: popped #b shifts from left 800 to 900; popLayout always anchors with `left` and ignores direction: rtl (upstream anchors RTL with `right`)"
		);
		const b = page.locator("#b");
		await visit(page, "?test=animate-presence-pop-rtl");
		await wait(page, 50);
		const initialLeft = (await bbox(b)).left;
		await trigger(page.locator("#container"), "click", 60, 60);
		await wait(page, 100);
		await should(async () => expect((await bbox(b)).left).toBe(initialLeft));
	});
});
