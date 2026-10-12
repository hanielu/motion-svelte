import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Drag Momentum", () => {
	test("Fast flick after hold produces momentum", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-momentum");
		await wait(page, 200);
		await wait(page, 200);
		await trigger(draggable, "pointerdown", 25, 900);
		await wait(page, 300); // Simulate holding before flick
		await trigger(draggable, "pointermove", 25, 895); // Cross distance threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 25, 800); // Quick flick upward
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 500); // Wait for momentum to carry element
		await should(async () => {
			const { top } = await bbox(draggable);

			// Element should have carried well past the release point
			// due to momentum. Without the fix, velocity is diluted by
			// the stale pointer-down point and momentum is minimal.
			expect(top).toBeLessThan(-200);
		});
	});

	test("Catch-and-release stops momentum", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-momentum");
		await wait(page, 200);
		await wait(page, 200);
		// Perform a drag-and-throw upward
		await trigger(draggable, "pointerdown", 25, 900);
		await trigger(draggable, "pointermove", 25, 895); // Cross distance threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 25, 700);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		// Wait for momentum to start
		await wait(page, 100);
		// Record position, then catch and release
		const caughtTop = Math.round((await bbox(draggable)).top);
		await trigger(draggable, "pointerdown", 25, 500);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 500); // Wait to see if element continues moving
		await should(async () => {
			const { top } = await bbox(draggable);

			// Element should stay near where it was caught,
			// not continue with old momentum.
			expect(Math.abs(top - caughtTop)).toBeLessThan(50);
		});
	});
});
