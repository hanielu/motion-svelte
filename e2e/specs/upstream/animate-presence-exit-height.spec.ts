import { expect, test, type Locator } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

/** `parseFloat(getComputedStyle(el).height)` of the first matching element. */
function computedHeight(target: Locator) {
	return target.first().evaluate((el) => parseFloat(getComputedStyle(el as HTMLElement).height));
}

test.describe("AnimatePresence exit with height", () => {
	test("Exit animation is not instant when closing an accordion item", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-height");
		await wait(page, 200);
		// Item A starts open — click it to close
		await trigger(page.locator('[data-id="a"]'), "click");
		// Wait 2s into a 10s linear exit animation (should be ~80% height)
		await wait(page, 2000);
		const height = await computedHeight(page.locator('[data-panel="a"]'));
		// If the exit animation is working, height should still be > 0
		// at 20% through a 10s animation
		expect(height).toBeGreaterThan(0);
	});

	test("Exit animation eventually removes the element", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-height");
		await wait(page, 200);
		await trigger(page.locator('[data-id="a"]'), "click");
		// Wait for full 10s exit + buffer
		await wait(page, 11000);
		await should(async () => expect(await page.locator('[data-panel="a"]').count()).toBe(0));
	});

	test("Opening a new item while another exits animates both", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-height");
		await wait(page, 200);
		// Click item B to open it (closes item A)
		await trigger(page.locator('[data-id="b"]'), "click");
		await wait(page, 2000);
		// Item A should still be mid-exit (height > 0)
		expect(await computedHeight(page.locator('[data-panel="a"]'))).toBeGreaterThan(0);
		// Item B should be mid-enter (height > 0)
		expect(await computedHeight(page.locator('[data-panel="b"]'))).toBeGreaterThan(0);
	});

	test("Interrupting enter animation does not break exit animation", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-height");
		await wait(page, 200);
		// Open item B (starts its enter animation, closes item A)
		await trigger(page.locator('[data-id="b"]'), "click");
		// Wait just 500ms — item B is still mid-enter
		await wait(page, 500);
		// Immediately close item B (interrupt the enter animation)
		await trigger(page.locator('[data-id="b"]'), "click");
		// Wait 2s into the exit animation
		await wait(page, 2000);
		const height = await computedHeight(page.locator('[data-panel="b"]'));
		// The exit animation should still be running, not instant
		expect(height).toBeGreaterThan(0);
	});

	test("Switching items mid-enter animates the exit", async ({ page }) => {
		await visit(page, "?test=animate-presence-exit-height");
		await wait(page, 200);
		// Open item B (starts enter, item A starts exit)
		await trigger(page.locator('[data-id="b"]'), "click");
		// Wait 500ms — item B is mid-enter
		await wait(page, 500);
		// Switch to item C (interrupts B's enter, B should exit)
		await trigger(page.locator('[data-id="c"]'), "click");
		// Wait a bit for the exit animation to be in progress
		await wait(page, 2000);
		// Item B should be mid-exit (height > 0)
		expect(await computedHeight(page.locator('[data-panel="b"]'))).toBeGreaterThan(0);
		// Item C should be mid-enter (height > 0)
		expect(await computedHeight(page.locator('[data-panel="c"]'))).toBeGreaterThan(0);
	});
});
