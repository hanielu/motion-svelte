import { expect, test, type Page } from "@playwright/test";
import { trigger, visit, wait } from "../../harness/upstream.js";

/** Toggles #box out and checks it is still there, fading, 100ms into its 300ms exit. */
async function expectExitToAnimate(page: Page) {
	const box = page.locator("#box");
	await trigger(page.locator("#toggle"), "click");
	await wait(page, 100);
	expect(await box.count()).toBe(1);
	expect(Number(await box.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
	await wait(page, 500);
	expect(await box.count()).toBe(0);
}

test.describe("AnimatePresence exits of children present at mount", () => {
	for (const intro of [true, false]) {
		test(`animate their first and later exits (intro: ${intro})`, async ({ page }) => {
			// intro: false is how SvelteKit hydrates and mounts the initial page.
			await visit(page, `?test=presence-first-exit&intro=${intro}`);
			await wait(page, 50);
			await expectExitToAnimate(page);
			await trigger(page.locator("#toggle"), "click");
			await wait(page, 400);
			await expectExitToAnimate(page);
		});
	}
});
