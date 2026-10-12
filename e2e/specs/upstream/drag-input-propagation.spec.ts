import { expect, test } from "@playwright/test";
import { bbox, should, trigger, visit, wait } from "../../harness/upstream.js";

/**
 * Tests for drag behavior with interactive elements inside draggable elements.
 *
 * Form controls where text selection or direct interaction is expected
 * (input, textarea, select, contenteditable) should NOT trigger drag.
 *
 * Buttons and links SHOULD allow drag since they don't have click-and-move
 * actions of their own.
 */
test.describe("Drag Input Propagation", () => {
	test("Should not drag when clicking and dragging on an input inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Initial position is at padding: 100
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Attempt to drag by clicking on the input
		const input = page.locator("[data-testid='input']");
		await trigger(input, "pointerdown", 5, 5);
		await trigger(input, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(input, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(input, "pointerup");

		// Verify the draggable element did NOT move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Element should still be at its initial position
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Should not drag when clicking and dragging on a textarea inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Attempt to drag by clicking on the textarea
		const textarea = page.locator("[data-testid='textarea']");
		await trigger(textarea, "pointerdown", 5, 5);
		await trigger(textarea, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(textarea, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(textarea, "pointerup");

		// Verify the draggable element did NOT move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Element should still be at its initial position
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Should drag when clicking and dragging on a button inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Drag by clicking on the button - buttons don't have click-and-move actions
		const button = page.locator("[data-testid='button']");
		await trigger(button, "pointerdown", 5, 5);
		await trigger(button, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(button, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(button, "pointerup");

		// Verify the draggable element DID move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Element should have moved
			expect(left).toBeGreaterThan(200);
			expect(top).toBeGreaterThan(200);
		});
	});

	test("Should drag when clicking and dragging on a link inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Drag by clicking on the link - links don't have click-and-move actions
		const link = page.locator("[data-testid='link']");
		await trigger(link, "pointerdown", 5, 5);
		await trigger(link, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(link, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(link, "pointerup");

		// Verify the draggable element DID move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Element should have moved
			expect(left).toBeGreaterThan(200);
			expect(top).toBeGreaterThan(200);
		});
	});

	test("Should not drag when clicking and dragging on a select inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Attempt to drag by clicking on the select
		const select = page.locator("[data-testid='select']");
		await trigger(select, "pointerdown", 5, 5);
		await trigger(select, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(select, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(select, "pointerup");

		// Verify the draggable element did NOT move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Should not drag when clicking and dragging on a checkbox inside a label inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Attempt to drag by clicking on the checkbox (nested inside label)
		const checkbox = page.locator("[data-testid='checkbox']");
		await trigger(checkbox, "pointerdown", 2, 2);
		await trigger(checkbox, "pointermove", 5, 5);
		await wait(page, 50);
		await trigger(checkbox, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(checkbox, "pointerup");

		// Verify the draggable element did NOT move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Should not drag when clicking and dragging on a contenteditable element inside draggable", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});

		// Attempt to drag by clicking on the contenteditable element
		const contenteditable = page.locator("[data-testid='contenteditable']");
		await trigger(contenteditable, "pointerdown", 5, 5);
		await trigger(contenteditable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(contenteditable, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(contenteditable, "pointerup");

		// Verify the draggable element did NOT move
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
	});

	test("Should still drag when clicking on the draggable area outside interactive elements", async ({ page }) => {
		const draggable = page.locator("[data-testid='draggable']");
		await visit(page, "?test=drag-input-propagation");
		await wait(page, 200);
		await should(async () => {
			const { left, top } = await bbox(draggable);
			expect(left).toBe(100);
			expect(top).toBe(100);
		});
		// Click on edge of draggable, not on interactive elements (at coordinates 5,5 which is top-left corner)
		await trigger(draggable, "pointerdown", 5, 5);
		await trigger(draggable, "pointermove", 10, 10);
		await wait(page, 50);
		await trigger(draggable, "pointermove", 200, 200);
		await wait(page, 50);
		await trigger(draggable, "pointerup");
		await should(async () => {
			const { left, top } = await bbox(draggable);
			// Element should have moved - the exact position depends on gesture calculation
			// but should NOT be at original position of 100,100
			expect(left).toBeGreaterThan(200);
			expect(top).toBeGreaterThan(200);
		});
	});
});
