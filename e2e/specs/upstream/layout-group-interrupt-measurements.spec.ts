/**
 * Counts getBoundingClientRect reads of #button when toggling #expander
 * re-measures #text-wrapper. #button is in its own LayoutGroup, so it should
 * only be re-measured while it's layout animating.
 *
 * Clicks are dispatched natively so Cypress actionability checks don't add
 * reads.
 */
import { expect, test, type Page } from "@playwright/test";
import { visit as visitFixture, wait } from "../../harness/upstream.js";

async function visit(page: Page) {
	await page.setViewportSize({ width: 500, height: 500 });
	// onBeforeLoad
	await page.addInitScript(() => {
		const win = window as any;
		win.reads = {};
		const getBoundingClientRect = win.Element.prototype.getBoundingClientRect;
		win.Element.prototype.getBoundingClientRect = function () {
			if (this.id) win.reads[this.id] = (win.reads[this.id] || 0) + 1;
			return getBoundingClientRect.call(this);
		};
	});
	await visitFixture(page, "?test=layout-group-interrupt");
	await wait(page, 250);
}

async function click(page: Page, id: string) {
	await page.evaluate((id) => {
		const win = window as any;
		win.reads = {};
		win.document.getElementById(id).click();
	}, id);
	await wait(page, 300);
}

async function expectReads(page: Page, id: string, count: number) {
	expect(await page.evaluate((id) => (window as any).reads[id] || 0, id)).toBe(count);
}

async function expectMeasured(page: Page, id: string) {
	expect(await page.evaluate((id) => (window as any).reads[id] || 0, id)).toBeGreaterThan(0);
}

test.describe(`LayoutGroup inherit="id" measurements`, () => {
	test("doesn't re-measure a relative child that isn't animating", async ({ page }) => {
		await visit(page);
		await click(page, "expander");
		await expectMeasured(page, "text-wrapper");
		await expectReads(page, "button", 0);
		await click(page, "expander");
		await expectMeasured(page, "text-wrapper");
		await expectReads(page, "button", 0);
	});

	test("re-measures a layout-animating relative child once per parent re-layout", async ({ page }) => {
		await visit(page);
		// Starts #button's 10s layout animation
		await click(page, "button");
		await click(page, "expander");
		await expectMeasured(page, "text-wrapper");
		await expectReads(page, "button", 1);
		await click(page, "expander");
		await expectMeasured(page, "text-wrapper");
		await expectReads(page, "button", 1);
	});
});
