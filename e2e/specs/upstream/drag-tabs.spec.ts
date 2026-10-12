import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

/** `getBoundingClientRect()`'s `left` and `right`. */
function horizontalBounds(target: Locator) {
	return target.first().evaluate((el) => {
		const { left, right } = el.getBoundingClientRect();
		return { left, right };
	});
}

test.describe("Tabs demo", () => {
	test("Layout animations don't interfere with opacity", async ({ page }) => {
		await visit(page, "?test=drag-tabs");
		const addItem = page.locator("button.add-item");
		await wait(page, 50);
		await addItem.click();
		await wait(page, 100);
		await should(async () => {
			expect(await page.locator("#Carrot-tab").evaluate((tab) => window.getComputedStyle(tab).opacity)).toBe("1");
		});
	});

	test("First tab doesn't distort when multiple layout animations started", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> instead of <li> (drops `as`), so the tab li styles never apply (Tomato label left 265 vs 280); passes with li styles forced onto the divs"
		);
		const label = page.locator("#Tomato-label");
		const addItem = page.locator("button.add-item");
		await visit(page, "?test=drag-tabs");
		await wait(page, 50);
		await should(async () => {
			const { left, right } = await horizontalBounds(label);
			expect(left).toBe(280);
			expect(right).toBe(390);
		});
		await addItem.click();
		await wait(page, 20);
		await addItem.click();
		await wait(page, 100);
		await should(async () => {
			const { left, right } = await horizontalBounds(label);
			expect(left).toBe(280);
			expect(right).toBe(334);
		});
	});

	test("Opacity finishes animating on reorder", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> not <li>, so the unpositioned close button sits under the tab center and the click deletes Lettuce (#Lettuce-tab disappears); with li styles forced, Tomato can no longer be dragged after the first reorder (left 405 vs 265)"
		);
		const lettuce = page.locator("#Lettuce-tab");
		const tomato = page.locator("#Tomato-tab");
		await visit(page, "?test=drag-tabs");
		// Cypress' defaultCommandTimeout: a command on a missing element fails after 4s instead of hanging until the
		// test timeout (a timeout wouldn't count as the expected failure).
		page.setDefaultTimeout(4000);
		await wait(page, 50);
		await lettuce.click();
		await trigger(lettuce, "pointerdown", 40, 10);
		await wait(page, 300);
		await trigger(lettuce, "pointermove", -40, 10); // Gesture will start from first move past threshold
		await trigger(lettuce, "pointermove", -100, 300);
		await wait(page, 50);
		await trigger(lettuce, "pointerup");
		await wait(page, 200);
		await should(async () => {
			expect(await page.locator("#Lettuce-content").evaluate((content) => window.getComputedStyle(content).opacity)).toBe(
				"1"
			);
		});
		await wait(page, 200);
		await trigger(tomato, "pointerdown", 40, 10);
		await trigger(tomato, "pointermove", -40, 10); // Gesture will start from first move past threshold
		await wait(page, 20);
		await trigger(tomato, "pointermove", -100, 300);
		await wait(page, 100);
		await trigger(tomato, "pointerup");
		await wait(page, 350);
		await should(async () => {
			const { left } = await bbox(tomato);
			expect(left).toBe(265);
		});
		await should(async () => {
			const { left } = await bbox(page.locator("#Tomato-label"));
			expect(left).toBe(280);
		});
	});

	test("Double removing item doesn't break exit animation", async ({ page }) => {
		const remove = page.locator("#Lettuce-remove");
		await visit(page, "?test=drag-tabs");
		await wait(page, 50);
		await remove.click();
		await wait(page, 20);
		// force: Cypress only waits out movement above 5px/frame, whereas Playwright would wait for the exit animation to
		// settle, by which point the button is detached and the click hangs until the test timeout.
		await remove.click({ force: true });
		await wait(page, 400);
		await should(async () => {
			const lettuce = page.locator("nav #Lettuce-tab");
			expect(await lettuce.count()).toBe(0);
		});
	});

	test("Removed tabs don't reappear on reorder", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> not <li> (Lettuce left 332.6 vs 475); with li styles forced, Lettuce can no longer be dragged after Tomato is removed (stays at 265 vs 475)"
		);
		const lettuce = page.locator("#Lettuce-tab");
		await visit(page, "?test=drag-tabs");
		await page.locator("#Tomato-remove").click();
		await wait(page, 400);
		await trigger(lettuce, "pointerdown", 40, 10);
		await wait(page, 30);
		await trigger(lettuce, "pointermove", 50, 10); // Gesture will start from first move past threshold
		await wait(page, 40);
		await trigger(lettuce, "pointermove", 200, 10);
		await wait(page, 100);
		await trigger(lettuce, "pointerup");
		await wait(page, 200);
		await should(async () => {
			const { left, right } = await horizontalBounds(lettuce);
			expect(left).toBe(475);
			expect(right).toBe(685);
		});
		await should(async () => {
			expect(await page.locator("nav .tab").count()).toBe(2);
		});
	});

	test("New items correctly reorderable", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: ReorderItem renders <div> instead of <li> (Carrot left 400.4 vs 475); passes with li styles forced onto the divs"
		);
		const carrot = page.locator("#Carrot-tab");
		await visit(page, "?test=drag-tabs");
		await wait(page, 50);
		await page.locator("button.add-item").click();
		await wait(page, 150);
		await wait(page, 50);
		await trigger(carrot, "pointerdown", 40, 10);
		await wait(page, 30);
		await trigger(carrot, "pointermove", -40, 10); // Gesture will start from first move past threshold
		await wait(page, 100);
		await trigger(carrot, "pointermove", -10, 10);
		await wait(page, 100);
		await trigger(carrot, "pointerup");
		await wait(page, 200);
		await should(async () => {
			const { left } = await bbox(carrot);
			expect(left).toBe(475);
		});
	});
});
