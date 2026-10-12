import { expect, test, type Page } from "@playwright/test";
import { bbox, should, visit, wait } from "../../harness/upstream.js";

/**
 * The button's top is recorded on every animation frame, so the "doesn't
 * jump" checks see every rendered position rather than a single sample
 * taken after a fixed wait, which slow CI can overshoot.
 */
async function recordButtonTops(page: Page) {
	await page.locator("#button").evaluate((button) => {
		const tops: number[] = ((window as any).buttonTops = []);
		const record = () => {
			tops.push(Math.round(button.getBoundingClientRect().top));
			requestAnimationFrame(record);
		};
		record();
	});
	return () => page.evaluate(() => (window as any).buttonTops as number[]);
}

/**
 * Unrounded, so this waits for the layout animation to finish rather than
 * its eased tail.
 */
function expectButtonToSettleAt(page: Page, top: number) {
	return should(async () => expect((await bbox(page.locator("#button"))).top).toBe(top));
}

function expectFramesBetween(tops: number[], from: number, to: number) {
	const between = tops.filter((top) => top !== from && top !== to);
	expect(between, `frames other than ${from} and ${to}: ${tops}`).not.toHaveLength(0);
}

test.describe(`LayoutGroup inherit="id"`, () => {
	test("relative children should not instantly jump to new layout", async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		const tops = await recordButtonTops(page);
		await page.locator("#expander").click();
		await expectButtonToSettleAt(page, 104);

		// Should have rendered positions between the original and final
		const recorded = await tops();
		expectFramesBetween(recorded, recorded[0], 104);
	});

	test("relative children should not instantly jump to new layout, after performing their own layout animation", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		// Click button first and let it finish its own layout animation
		await page.locator("#button").click();
		await expectButtonToSettleAt(page, 129);

		const tops = await recordButtonTops(page);
		await page.locator("#expander").click();
		await expectButtonToSettleAt(page, 204);

		expectFramesBetween(await tops(), 129, 204);
	});

	test("should return to original state when expander is clicked twice with delay", async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group");
		await wait(page, 250);

		const tops = await recordButtonTops(page);
		await page.locator("#expander").click();

		// Click the expander again once the button is mid-animation
		await should(async () => {
			const recorded = await tops();
			expectFramesBetween(recorded, recorded[0], 104);
		});
		await wait(page, 50);
		await page.locator("#expander").click();

		// Should be back to original state
		await expectButtonToSettleAt(page, (await tops())[0]);
	});
});
