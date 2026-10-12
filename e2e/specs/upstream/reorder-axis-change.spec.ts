/**
 * Tests for #3022: Reorder.Group stops working if axis changes
 * after window resize (via matchMedia).
 */
import { expect, test } from "@playwright/test";
import { should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Reorder axis change on resize", () => {
	test("Baseline: reorder works without axis change", async ({ page }) => {
		const tomato = page.locator("[data-testid='Tomato']");
		await page.setViewportSize({ width: 400, height: 600 });
		await visit(page, "?test=reorder-axis-change");
		await wait(page, 200);

		await should(async () => expect(await page.locator("[data-testid='current-axis']").textContent()).toBe("y"));

		// Drag Tomato down past Cucumber using element-relative coords
		await trigger(tomato, "pointerdown", 40, 25);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 30);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 50);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 80);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 110);
		await wait(page, 100);

		const order = await page.locator("[data-testid='current-order']").textContent();
		expect(order).not.toBe("Tomato,Cucumber,Cheese,Lettuce");

		await trigger(tomato, "pointerup", 40, 110);
	});

	test("Reorders correctly after axis changes via resize", async ({ page }) => {
		test.fail(
			true,
			"motion-sv: once ReorderGroup's axis changes after mount (y->x via matchMedia here), ReorderItem drags never start again, so the order never changes"
		);
		const tomato = page.locator("[data-testid='Tomato']");
		// Start wide so axis='x'
		await page.setViewportSize({ width: 600, height: 600 });
		await visit(page, "?test=reorder-axis-change");
		await wait(page, 200);

		await should(async () => expect(await page.locator("[data-testid='current-axis']").textContent()).toBe("x"));

		// Resize to trigger matchMedia → axis='y'
		await page.setViewportSize({ width: 400, height: 600 });
		await wait(page, 500);
		await should(async () => expect(await page.locator("[data-testid='current-axis']").textContent()).toBe("y"));

		// Drag Tomato down past Cucumber
		await trigger(tomato, "pointerdown", 40, 25);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 30);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 50);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 80);
		await wait(page, 50);
		await trigger(tomato, "pointermove", 40, 110);
		await wait(page, 100);

		const order = await page.locator("[data-testid='current-order']").textContent();
		expect(order).not.toBe("Tomato,Cucumber,Cheese,Lettuce");

		await trigger(tomato, "pointerup", 40, 110);
	});
});
