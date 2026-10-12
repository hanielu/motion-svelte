import { expect, test, type Locator } from "@playwright/test";
import { bbox, should, trigger, visit, wait, triggerInView } from "../../harness/upstream.js";

/**
 * In this test suite there's two sets of each test, one without and one with the `layout` prop.
 * This is because when a component has the layout prop applied, we apply drag to the bounding box
 * and when it isn't, we apply it to the x/y transform.
 *
 * Descrepencies between the expected values in the two sets of tests are *something* to do with how
 * pointer events are being resolved with Cypress, but a manual check will verify that both drag modes
 * are working visually the same.
 */
test.describe("Drag", () => {
	test("Drags the element by the defined distance", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(300);
		});
	});

	// Upstream reuses the previous test's title; Playwright rejects duplicate titles, hence the suffix.
	test("Drags the element by the defined distance (showChild)", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable-child']");
		await visit(page, "?test=drag&showChild=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(300);
		});
	});

	test("Drags the element by the defined distance with different initial offset", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&x=100&y=100");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(300);

			// TODO: This should actually be 400, but for some reason the test scroll
			// scrolls an additional 100px when dragging starts. But this has been manually verified
			// as working
			expect(top).toBe(300);
		});
	});

	test("Drags the element by the defined distance with percentage initial offset", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&x=200&y=200&percentage=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(300);

			// TODO: This should actually be 400, but for some reason the test scroll
			// scrolls an additional 100px when dragging starts. But this has been manually verified
			// as working
			expect(top).toBe(300);
		});
	});

	test("Locks drag to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&axis=x");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await wait(page, 50);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(0);
		});
	});

	test("Locks drag to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&axis=y");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(0);
			expect(top).toBe(300);
		});
	});

	// Having trouble making this test work (commented out upstream)
	test.skip("Direction locks to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await page.reload();
		await visit(page, "?test=drag&lock=true");
		await wait(page, 200);
		await wait(page, 200);
		await trigger(draggable, "pointerdown", 5, 5);
		await trigger(draggable, "pointermove", 5, 5); // Gesture will start from first move past threshold
		await wait(page, 100);
		await trigger(draggable, "pointermove", 200, 10);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 200);
		await wait(page, 100);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(top).toBe(0);
			expect(left).toBe(200);
		});
	});

	test("Direction locks to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await page.reload();
		await visit(page, "?test=drag&lock=true");
		await wait(page, 200);
		await wait(page, 200);
		await trigger(draggable, "pointerdown", 5, 5);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 100);
		await trigger(draggable, "pointermove", 10, 200);
		await wait(page, 100);
		await trigger(draggable, "pointermove", 200, 10);
		await wait(page, 100);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(0);
			expect(top).toBe(200);
		});
	});

	test("Constraints as object: bottom right", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&right=100&bottom=100");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Constraints as object: top left", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&left=-10&top=-10");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 40, 40);
		await triggerInView(draggable, "pointermove", 30, 30); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(-10);
			expect(top).toBe(-10);
		});
	});

	test("Element returns to center with dragSnapToOrigin", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&return=true&left=-10&top=-10");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 40, 40);
		await triggerInView(draggable, "pointermove", 30, 30); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(-10);
			expect(top).toBe(-10);
		});
		await trigger(draggable, "pointerup");
		await wait(page, 100);
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(0);
			expect(top).toBe(0);
		});
	});

	test("Element returns to center on x axis only with dragSnapToOrigin='x'", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&return=x&left=-10&top=-10");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 40, 40);
		await triggerInView(draggable, "pointermove", 30, 30); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 300);
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// x should snap back to origin (0)
			expect(left).toBe(0);
			// y should NOT snap back - it stays at the constraint
			expect(top).toBe(-10);
		});
	});

	test("Element returns to center on y axis only with dragSnapToOrigin='y'", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&return=y&left=-10&top=-10");
		await wait(page, 200);
		await wait(page, 100);
		await triggerInView(draggable, "pointerdown", 40, 40);
		await triggerInView(draggable, "pointermove", 30, 30); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 300);
		await should(async () => {
			const { left, top } = await bbox(draggable);

			// x should NOT snap back - it stays at the constraint
			expect(left).toBe(-10);
			// y should snap back to origin (0)
			expect(top).toBe(0);
		});
	});

	test("doesn't reset drag constraints (ref-based), while dragging, on unrelated parent component updates", async ({
		page,
	}) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-ref-constraints");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 10, 10);
		await triggerInView(draggable, "pointermove", 15, 15);
		await wait(page, 200);
		await trigger(draggable, "pointermove", 300, 300);
		await wait(page, 200);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(150);
			expect(top).toBe(150);
		});
	});

	test("rescales draggable element in relation to resized constraints", async ({ page }) => {
		const constraints = page.locator("#constraints");
		const box = page.locator("#box");
		const rect = (target: Locator) =>
			target.first().evaluate((el) => {
				const { left, top, right, bottom } = el.getBoundingClientRect();
				return { left, top, right, bottom };
			});

		await visit(page, "?test=drag-ref-constraints-resize");
		await wait(page, 200);
		await should(async () => {
			const { left, top, right, bottom } = await rect(constraints);
			expect(left).toBe(250);
			expect(top).toBe(0);
			expect(right).toBe(750);
			expect(bottom).toBe(300);
		});
		await should(async () => {
			const { left, top, right, bottom } = await rect(box);
			expect(left).toBe(400);
			expect(top).toBe(50);
			expect(right).toBe(600);
			expect(bottom).toBe(250);
		});
		await triggerInView(box, "pointerdown", 5, 5);
		await triggerInView(box, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(box, "pointermove", 200, 200);
		await wait(page, 100);
		await trigger(box, "pointerup", undefined, undefined, { isPrimary: true });
		await wait(page, 50);
		await trigger(box, "pointermove", 500, 500);
		await wait(page, 200);
		await should(async () => {
			const { left, top, right, bottom } = await rect(box);
			expect(left).toBe(550);
			expect(top).toBe(100);
			expect(right).toBe(750);
			expect(bottom).toBe(300);
		});
		await page.setViewportSize({ width: 800, height: 660 });
		await wait(page, 50);
		await should(async () => {
			const { left, right } = await rect(constraints);
			expect(left).toBe(200);
			expect(right).toBe(600);
		});
		await should(async () => {
			const { left, right } = await rect(box);
			expect(left).toBe(400);
			expect(right).toBe(600);
		});

		await page.setViewportSize({ width: 1000, height: 660 });
		await wait(page, 50);
		await should(async () => {
			const { left, top, right, bottom } = await rect(constraints);
			expect(left).toBe(250);
			expect(top).toBe(0);
			expect(right).toBe(750);
			expect(bottom).toBe(300);
		});
		await should(async () => {
			const { left, right } = await rect(box);
			expect(left).toBe(550);
			expect(right).toBe(750);
		});
	});

	test("Snaps to cursor", async ({ page }) => {
		const scrollable = page.locator("#scrollable");
		const rect = (target: Locator) =>
			target.first().evaluate((el) => {
				const { left, top, right, bottom } = el.getBoundingClientRect();
				return { left, top, right, bottom };
			});

		await visit(page, "?test=drag-snap-to-cursor");
		await wait(page, 200);
		await page.evaluate(() => window.scrollTo(0, 800));
		await should(async () => {
			const { top, left, right, bottom } = await rect(scrollable);
			expect(top).toBe(200);
			expect(right).toBe(740);
			expect(bottom).toBe(500);
			expect(left).toBe(240);
		});
		await triggerInView(page.locator("#scroll-trigger"), "pointerdown", 5, 5);
		await wait(page, 50);
		await should(async () => {
			const { top, left, right, bottom } = await rect(scrollable);
			expect(top).toBe(-125);
			expect(right).toBe(275);
			expect(bottom).toBe(175);
			expect(left).toBe(-225);
		});
	});
});

test.describe("Drag & Layout", () => {
	test("Drags the element by the defined distance", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(300);
		});
	});

	test("Drags the element by the defined distance with different initial offset", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&x=100&y=100&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(300);

			// TODO: This should actually be 400, but for some reason the test scroll
			// scrolls an additional 100px when dragging starts. But this has been manually verified
			// as working
			expect(top).toBe(300);
		});
	});

	test("Locks drag to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&axis=x&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(200);
			expect(top).toBe(0);
		});
	});

	test("Locks drag to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&axis=y&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(0);
			expect(top).toBe(300);
		});
	});

	// Having trouble making this test work (commented out upstream)
	test.skip("Direction locks to x", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await page.reload();
		await visit(page, "?test=drag&lock=true&layout=true");
		await wait(page, 100);
		await wait(page, 200);
		await trigger(draggable, "pointerdown", 5, 5);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 5, 5); // Gesture will start from first move past threshold
		await wait(page, 100);
		await trigger(draggable, "pointermove", 200, 10);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 200);
		await wait(page, 100);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(190);
			expect(top).toBe(0);
		});
	});

	test("Direction locks to y", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&lock=true&layout=true");
		await wait(page, 100);
		await wait(page, 200);
		await trigger(draggable, "pointerdown", 5, 5);
		await trigger(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 100);
		await trigger(draggable, "pointermove", 10, 200);
		await wait(page, 100);
		await trigger(draggable, "pointermove", 200, 10);
		await wait(page, 100);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(0);
			expect(top).toBe(200);
		});
	});

	test("Constraints as object: bottom right", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&right=100&bottom=100&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 5, 5);
		await triggerInView(draggable, "pointermove", 10, 10); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Constraints as object: top left", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag&left=-10&top=-10&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 40, 40);
		await triggerInView(draggable, "pointermove", 30, 30); // Gesture will start from first move past threshold
		await wait(page, 50);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(-10);
			expect(top).toBe(-10);
		});
	});

	test("doesn't reset drag constraints (ref-based), while dragging, on unrelated parent component updates", async ({
		page,
	}) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-ref-constraints&layout=true");
		await wait(page, 200);
		await triggerInView(draggable, "pointerdown", 10, 10);
		await triggerInView(draggable, "pointermove", 15, 15);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 300, 300);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);

			expect(left).toBe(150);
			expect(top).toBe(150);
		});
	});
});

test.describe("Drag Constraints Return", () => {
	test("Returns to constraints when released outside bounds", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-constraints-return");
		await wait(page, 200);
		await wait(page, 100);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await wait(page, 50);
		// Drag outside constraints (to bottom-right)
		await trigger(draggable, "pointermove", 400, 400);
		await wait(page, 50);
		// Release - element should animate back
		await trigger(draggable, "pointerup");
		await wait(page, 2000); // Wait for animation to complete
		await should(async () => {
			const { left, top, right, bottom } = await draggable
				.first()
				.evaluate((el) => el.getBoundingClientRect().toJSON());

			// Constraints box is 300x300, element is 100x100
			// Element should be within the constraints (max position: 200, 200)
			expect(right).toBeLessThanOrEqual(302);
			expect(bottom).toBeLessThanOrEqual(302);
			expect(left).toBeGreaterThanOrEqual(-2);
			expect(top).toBeGreaterThanOrEqual(-2);
		});
	});

	test("Returns to constraints when released outside and clicked during animation", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-constraints-return");
		await wait(page, 200);
		await wait(page, 100);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await wait(page, 50);
		// Drag outside constraints (to bottom-right)
		await trigger(draggable, "pointermove", 400, 400);
		await wait(page, 50);
		// Release - element should start animating back
		await trigger(draggable, "pointerup");
		// Immediately click on element while it's animating back
		await wait(page, 50);
		await trigger(draggable, "pointerdown", 50, 50);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await wait(page, 2000); // Wait for animation to complete
		await should(async () => {
			const { left, top, right, bottom } = await draggable
				.first()
				.evaluate((el) => el.getBoundingClientRect().toJSON());

			// Constraints box is 300x300, element is 100x100
			// Element should be within the constraints (max position: 200, 200)
			expect(right).toBeLessThanOrEqual(302);
			expect(bottom).toBeLessThanOrEqual(302);
			expect(left).toBeGreaterThanOrEqual(-2);
			expect(top).toBeGreaterThanOrEqual(-2);
		});
	});

	test("Does not jump when dragged again during animation", async ({ page }) => {
		let positionBeforeRelease = { right: 0, bottom: 0 };
		const draggable = page.locator("[data-testid='draggable']");
		const rect = () => draggable.first().evaluate((el) => el.getBoundingClientRect().toJSON());

		await visit(page, "?test=drag-constraints-return");
		await wait(page, 200);
		await wait(page, 100);
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Gesture will start from first move past threshold
		await wait(page, 50);
		// Drag outside constraints (to bottom-right)
		await trigger(draggable, "pointermove", 400, 400);
		await wait(page, 50);
		// Release - element should start animating back
		await trigger(draggable, "pointerup");
		await wait(page, 50);
		// Verify element is still animating (not yet within bounds)
		await should(async () => {
			const { right, bottom } = await rect();
			// Element should still be outside constraints (animating back)
			expect(right).toBeGreaterThan(302);
			expect(bottom).toBeGreaterThan(302);
		});
		// Now grab and DRAG the element again with a LARGE drag (200px)
		// The bug causes a jump proportional to drag size
		await trigger(draggable, "pointerdown", 50, 50);
		await trigger(draggable, "pointermove", 60, 60); // Start gesture
		await wait(page, 50);
		await trigger(draggable, "pointermove", 250, 250); // Drag by ~200px
		await wait(page, 50);
		// Record position before release
		{
			const { right, bottom } = await rect();
			positionBeforeRelease = { right, bottom };
		}
		// Release again
		await trigger(draggable, "pointerup");
		await wait(page, 16); // One frame
		// Verify element hasn't jumped - position should be close to where it was before release
		await should(async () => {
			const { right, bottom } = await rect();
			// Allow small movement from animation starting, but no large jump (max 30px)
			// Bug: without fix, element jumps back towards first drag end position
			expect(Math.abs(right - positionBeforeRelease.right)).toBeLessThan(30);
			expect(Math.abs(bottom - positionBeforeRelease.bottom)).toBeLessThan(30);
		});
	});
});
