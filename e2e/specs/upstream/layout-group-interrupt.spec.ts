import { expect, test, type Page } from "@playwright/test";
import { nextFrame, should, visit, wait } from "../../harness/upstream.js";

interface Measurement {
	top: number;
	left: number;
	offsetTop: number;
}

function measure(page: Page): Promise<Measurement> {
	return page.evaluate(() => {
		const button = document.getElementById("button")!.getBoundingClientRect();
		const parent = document.getElementById("text-wrapper")!.getBoundingClientRect();
		return {
			top: button.top,
			left: button.left,
			offsetTop: button.top - parent.top,
		};
	});
}

/** `expect(actual).to.be.closeTo(expected, delta)` */
function expectCloseTo(actual: number, expected: number, delta: number) {
	expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

test.describe(`LayoutGroup inherit="id"`, () => {
	test("relative child follows its parent when a parent layout change interrupts its own layout animation", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 500, height: 500 });
		await visit(page, "?test=layout-group-interrupt");
		await wait(page, 250);

		let before: Measurement;
		const initial = await measure(page);

		await page.locator("#button").click();

		// Wait until #button is part-way through its own 110px animation
		await should(async () => {
			const delta = (await measure(page)).top - initial.top;
			expect(delta).toBeGreaterThanOrEqual(20);
			expect(delta).toBeLessThanOrEqual(90);
		});

		/**
		 * #text-wrapper is re-measured, #button isn't. #button should
		 * neither jump by #text-wrapper's 75px layout shift nor skip the
		 * rest of its own horizontal animation within #text-wrapper.
		 */
		const toggleExpander = async () => {
			before = await measure(page);
			// Cypress only waits out elements moving more than 5px a frame; #expander creeps through a 10s layout
			// animation, which never passes Playwright's stable check.
			await page.locator("#expander").click({ force: true });
			await nextFrame(page);
			const after = await measure(page);
			expect(Math.abs(after.top - before.top)).toBeLessThan(20);
			expect(Math.abs(after.left - before.left)).toBeLessThan(10);
			expectCloseTo(after.offsetTop, initial.offsetTop, 1);
		};

		await toggleExpander();
		await wait(page, 500);
		await toggleExpander();
		await wait(page, 500);
		expectCloseTo((await measure(page)).offsetTop, initial.offsetTop, 1);
	});
});
