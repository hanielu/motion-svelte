import { expect, test, type Locator } from "@playwright/test";
import { bbox, nextFrame, should, visit, wait } from "../../harness/upstream.js";

/**
 * Release velocity only looks at the last 100ms of pointer history, and
 * PanSession applies each pointermove on the next animation frame. Separate
 * cy.trigger() calls can be >100ms apart on slow CI, so the throw is
 * dispatched directly: final pointermove, one frame, then pointerup.
 */
function dispatchPointer(target: Locator, type: string, clientY: number) {
	return target.evaluate(
		(el, { type, clientY }) => {
			el.dispatchEvent(
				new PointerEvent(type, {
					clientX: el.getBoundingClientRect().left + 25,
					clientY,
					pointerId: 1,
					pointerType: "mouse",
					isPrimary: true,
					button: 0,
					bubbles: true,
					cancelable: true,
				})
			);
		},
		{ type, clientY }
	);
}

async function flick(target: Locator, clientY: number) {
	await dispatchPointer(target, "pointermove", clientY);
	await nextFrame(target.page());
	await dispatchPointer(target, "pointerup", clientY);
}

const topOf = async (target: Locator) => (await bbox(target)).top;

test.describe("Drag Momentum", () => {
	test("Fast flick after hold produces momentum", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-momentum");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		const startTop = await topOf(draggable);
		await dispatchPointer(draggable, "pointerdown", startTop + 900);
		await wait(page, 300); // Simulate holding before flick
		// Cross distance threshold
		await dispatchPointer(draggable, "pointermove", startTop + 895);
		await nextFrame(page); // Start the pan before the flick
		await wait(page, 50);
		await flick(draggable, startTop + 800); // Quick flick upward
		await wait(page, 500); // Wait for momentum to carry element
		await should(async () => {
			// Element should have carried well past the release point
			// due to momentum. Without the fix, velocity is diluted by
			// the stale pointer-down point and momentum is minimal.
			expect(await topOf(draggable)).toBeLessThan(-200);
		});
	});

	test("Catch-and-release stops momentum", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-momentum");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		// Perform a drag-and-throw upward
		const startTop = await topOf(draggable);
		await dispatchPointer(draggable, "pointerdown", startTop + 900);
		await dispatchPointer(draggable, "pointermove", startTop + 895); // Cross distance threshold
		await nextFrame(page); // Start the pan before the flick
		await wait(page, 50);
		await flick(draggable, startTop + 700);
		const releasedTop = await topOf(draggable);
		// Wait until momentum is visibly carrying the element, or the
		// catch is untested
		await should(async () => {
			expect(releasedTop - (await topOf(draggable))).toBeGreaterThan(20);
		});
		// Catch. Pointerdown stops the animation, which renders its
		// final value on the next frame.
		await dispatchPointer(draggable, "pointerdown", startTop + 500);
		await nextFrame(page);
		const caughtTop = await topOf(draggable);
		await wait(page, 50);
		await dispatchPointer(draggable, "pointerup", startTop + 500);
		await wait(page, 500); // Wait to see if element continues moving
		await should(async () => {
			// Element should stay near where it was caught,
			// not continue with old momentum.
			expect(Math.abs((await topOf(draggable)) - caughtTop)).toBeLessThan(50);
		});
	});
});
