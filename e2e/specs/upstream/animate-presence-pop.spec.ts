import { test } from "@playwright/test";
import { expectBbox, trigger, visit, wait } from "../../harness/upstream.js";

function runTests(url: string) {
	const name = "AnimatePresence popLayout" + (url.includes("layout-container") ? " with layout animations" : "");

	test.describe(name, () => {
		test("correctly pops exiting elements out of the DOM", async ({ page }) => {
			const b = page.locator("#b");
			const c = page.locator("#c");
			await visit(page, url);
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
			const b = page.locator("#b");
			const c = page.locator("#c");
			await visit(page, url + "&position=relative");
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

		test("correctly pops exiting elements out of the DOM when anchorX is set to right", async ({ page }) => {
			const b = page.locator("#b");
			const c = page.locator("#c");
			await visit(page, url + "&anchor-x=right");
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
	});
}

runTests("?test=animate-presence-pop");
runTests("?test=animate-presence-pop-layout-container");
