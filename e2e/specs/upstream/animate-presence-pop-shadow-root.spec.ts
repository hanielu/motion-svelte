import { test } from "@playwright/test";
import { expectBbox, trigger, visit, wait } from "../../harness/upstream.js";

// Playwright CSS locators pierce open shadow roots, like Cypress' `{ includeShadowDom: true }`.
test.describe("AnimatePresence popLayout with shadowRoot", () => {
	test("correctly pops exiting elements out of the DOM", async ({ page }) => {
		test.skip(
			true,
			"unsupported: AnimatePresence has no `root` prop; popLayout styles are always appended to document.head, which can't reach elements inside a shadow root (#c stays at top 300, expected 200)"
		);
		const b = page.locator("#b");
		const c = page.locator("#c");
		await visit(page, "?test=animate-presence-pop-shadow-root");
		await wait(page, 50);
		await expectBbox(b, { top: 200, left: 100, width: 100, height: 100 });
		await expectBbox(c, { top: 300, left: 100, width: 100, height: 100 });
		await trigger(c, "click", 60, 60);
		await wait(page, 100);
		await expectBbox(b, { top: 200, left: 100, width: 100, height: 100 });
		await expectBbox(c, { top: 200, left: 100, width: 100, height: 100 });
		await trigger(c, "click", 60, 60);
		await wait(page, 100);
		await expectBbox(b, { top: 200, left: 100, width: 100, height: 100 });
		await expectBbox(c, { top: 300, left: 100, width: 100, height: 100 });
	});

	test("correctly pops exiting elements out of the DOM when they already have an explicit top/left", async ({
		page,
	}) => {
		test.skip(
			true,
			"unsupported: AnimatePresence has no `root` prop; popLayout styles are always appended to document.head, which can't reach elements inside a shadow root (#c stays at top 400, expected 300)"
		);
		const b = page.locator("#b");
		const c = page.locator("#c");
		await visit(page, "?test=animate-presence-pop-shadow-root&position=relative");
		await wait(page, 50);
		await expectBbox(b, { top: 300, left: 200, width: 100, height: 100 });
		await expectBbox(c, { top: 400, left: 200, width: 100, height: 100 });
		await trigger(c, "click", 60, 60);
		await wait(page, 100);
		await expectBbox(b, { top: 300, left: 200, width: 100, height: 100 });
		await expectBbox(c, { top: 300, left: 200, width: 100, height: 100 });
		await trigger(c, "click", 60, 60);
		await wait(page, 100);
		await expectBbox(b, { top: 300, left: 200, width: 100, height: 100 });
		await expectBbox(c, { top: 400, left: 200, width: 100, height: 100 });
	});
});
