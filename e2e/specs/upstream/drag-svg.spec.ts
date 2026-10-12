/**
 * In this test suite there's two sets of each test, one without and one with the `layout` prop.
 * This is because when a component has the layout prop applied, we apply drag to the bounding box
 * and when it isn't, we apply it to the x/y transform.
 *
 * Discrepancies between the expected values in the two sets of tests are *something* to do with how
 * pointer events are being resolved with Cypress, but a manual check will verify that both drag modes
 * are working visually the same.
 *
 * PanSession applies pointermove on the next animation frame, and pointerup
 * discards a move that hasn't been applied yet. Cypress also resolves trigger
 * coordinates against the element's current box. So each pointermove is
 * followed by nextFrame() rather than a fixed wait, which slow CI can outrun.
 *
 * Gestures that start straight after the page loads first wait two frames:
 * React 19 StrictMode remounts refs after the first paint, which cancels a
 * gesture started before then.
 */
import { expect, test } from "@playwright/test";
import { bbox, nextFrame, should, trigger, visit, wait } from "../../harness/upstream.js";

test.describe("Drag SVG", () => {
	test("Drags the element by the defined distance", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg");
		await wait(page, 50);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 210, 310);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(300);
		});
	});

	test("Locks drag to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&axis=x");
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 300);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(190);
			expect(top).toBe(30);
		});
	});

	test("Locks drag to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&axis=y");
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 300);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(30);
			expect(top).toBe(290);
		});
	});

	// TODO: Figure out direction lock tests in Cypress
	// (upstream keeps "Direction locks to x" / "Direction locks to y" commented out)

	test("Constraints as object: bottom right", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&right=100&bottom=100");
		await wait(page, 200);
		await wait(page, 100);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 200);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(130);
			expect(top).toBe(130);
		});
	});

	test("Constraints as object: top left", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&left=-10&top=-10");
		await wait(page, 200);
		await wait(page, 100);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 10, 10);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(20);
			expect(top).toBe(20);
		});
	});
});

test.describe("Drag SVG & Layout", () => {
	test("Drags the element by the defined distance", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&layout=true");
		await wait(page, 50);
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(30);
			expect(top).toBe(30);
		});
		await wait(page, 50);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 300);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(190);
			expect(top).toBe(290);
		});
	});

	test("Locks drag to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&axis=x&layout=true");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 300);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(190);
			expect(top).toBe(30);
		});
	});

	test("Locks drag to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&axis=y&layout=true");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 300);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(30);
			expect(top).toBe(290);
		});
	});

	// TODO: Figure out direction lock tests in Cypress
	// (upstream keeps "Direction locks to x" / "Direction locks to y" commented out)

	test("Constraints as object: bottom right", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&right=100&bottom=100&layout=true");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 200, 200);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(130);
			expect(top).toBe(130);
		});
	});

	test("Constraints as object: top left", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-svg&left=-10&top=-10&layout=true");
		await wait(page, 200);
		await wait(page, 200);
		await nextFrame(page);
		await nextFrame(page);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await nextFrame(page);
		await trigger(draggable, "pointermove", 10, 10);
		await nextFrame(page);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(20);
			expect(top).toBe(20);
		});
	});
});
