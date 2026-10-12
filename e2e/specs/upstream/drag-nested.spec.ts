import { expect, test, type Locator, type Page } from "@playwright/test";
import { bbox, nextFrame, should, trigger, visit, wait, type BoundingBox } from "../../harness/upstream.js";

async function expectBbox(element: Locator, expectedBbox: Partial<BoundingBox>) {
	const box = await bbox(element);
	expect(box.left).toBe(expectedBbox.left);
	expect(box.top).toBe(expectedBbox.top);
	if (expectedBbox.width) expect(box.width).toBe(expectedBbox.width);
	if (expectedBbox.height) expect(box.height).toBe(expectedBbox.height);
}

/**
 * PanSession applies pointermove on the next animation frame, and pointerup
 * discards a move that hasn't been applied yet. Cypress also resolves trigger
 * coordinates against the element's current box. So each pointermove is
 * followed by nextFrame() rather than a fixed wait, which slow CI can outrun.
 */
async function testNestedDrag(page: Page, parentLayout: boolean, childLayout: boolean) {
	let url = `?test=drag-layout-nested`;
	if (parentLayout) url += `&parentLayout=true`;
	if (childLayout) url += `&childLayout=true`;

	const parent = page.locator("#parent");
	const child = page.locator("#child");
	const control = page.locator("#control");

	await visit(page, url);
	await wait(page, 200);
	await should(() =>
		expectBbox(parent, {
			top: 100,
			left: 100,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 150,
			left: 150,
			width: 600,
			height: 200,
		})
	);
	await should(() =>
		expectBbox(control, {
			top: 200,
			left: 200,
		})
	);
	await nextFrame(page);
	await nextFrame(page);
	await trigger(parent, "pointerdown", 5, 5);
	await wait(page, 50);
	await trigger(parent, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(parent, "pointermove", 50, 50);
	await nextFrame(page);
	await trigger(parent, "pointerup");
	await should(() =>
		expectBbox(parent, {
			top: 150,
			left: 150,
			width: 300,
			height: 300,
		})
	);
	await should(() => expectBbox(control, { top: 250, left: 250 }));
	await should(() =>
		expectBbox(child, {
			top: 200,
			left: 200,
			width: 600,
			height: 200,
		})
	);
	await trigger(child, "pointerdown", 5, 5);
	await wait(page, 50);
	await trigger(child, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(child, "pointermove", 50, 50);
	await nextFrame(page);
	await should(() =>
		expectBbox(parent, {
			top: 150,
			left: 150,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 250,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 300, left: 300 }));
	await trigger(control, "pointerup");
	await wait(page, 50);
	await should(() =>
		expectBbox(parent, {
			top: 150,
			left: 150,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 250,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 300, left: 300 }));
	await trigger(parent, "pointerdown", 5, 5);
	await wait(page, 50);
	await trigger(parent, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(parent, "pointermove", 50, 50);
	await nextFrame(page);
	await trigger(parent, "pointerup");
	await should(() =>
		expectBbox(parent, {
			top: 200,
			left: 200,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 300,
			left: 300,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 350, left: 350 }));
}

test.describe("Nested drag", () => {
	test("Parent: layout, Child: layout", ({ page }) => testNestedDrag(page, true, true));
	test("Parent: layout", ({ page }) => testNestedDrag(page, true, false));
	test("Child: layout", ({ page }) => testNestedDrag(page, false, true));
	test("Neither", ({ page }) => testNestedDrag(page, false, false));
});

async function testNestedDragConstraints(page: Page, parentLayout: boolean, childLayout: boolean) {
	let url = `?test=drag-layout-nested&constraints=true`;
	if (parentLayout) url += `&parentLayout=true`;
	if (childLayout) url += `&childLayout=true`;

	const parent = page.locator("#parent");
	const child = page.locator("#child");
	const control = page.locator("#control");

	await visit(page, url);
	await wait(page, 200);
	await nextFrame(page);
	await nextFrame(page);
	await trigger(parent, "pointerdown", 40, 40);
	await wait(page, 50);
	await trigger(parent, "pointermove", 35, 35); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(parent, "pointermove", 20, 20);
	await nextFrame(page);
	await trigger(parent, "pointerup");
	await should(() =>
		// Should have only moved 10 px to the top
		expectBbox(parent, {
			top: 90,
			left: 75,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 140,
			left: 125,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 190, left: 175 }));
	await trigger(parent, "pointerdown", 5, 5);
	await wait(page, 50);
	await trigger(parent, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(parent, "pointermove", 200, 100);
	await nextFrame(page);
	await trigger(parent, "pointerup");
	await should(() =>
		expectBbox(parent, {
			top: 190,
			left: 200,
			width: 300,
			height: 300,
		})
	);
	await should(() => expectBbox(control, { top: 290, left: 300 }));
	await should(() =>
		expectBbox(child, {
			top: 240,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await trigger(child, "pointerdown", 5, 5);
	await wait(page, 50);
	await trigger(child, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(child, "pointermove", 300, 100);
	await nextFrame(page);
	await trigger(child, "pointerup");
	await should(() =>
		expectBbox(parent, {
			top: 190,
			left: 200,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 340,
			left: 350,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 390, left: 400 }));
}

test.describe("Nested drag with constraints", () => {
	test("Parent: layout, Child: layout", ({ page }) => testNestedDragConstraints(page, true, true));
	test("Parent: layout", ({ page }) => testNestedDragConstraints(page, true, false));
	test("Child: layout", ({ page }) => testNestedDragConstraints(page, false, true));
	test("Neither", ({ page }) => testNestedDragConstraints(page, false, false));
});

async function testNestedDragConstraintsAndAnimation(page: Page, parentLayout: boolean, childLayout: boolean) {
	let url = `?test=drag-layout-nested&constraints=true&animation=true`;
	if (parentLayout) url += `&parentLayout=true`;
	if (childLayout) url += `&childLayout=true`;

	const parent = page.locator("#parent");
	const child = page.locator("#child");
	const control = page.locator("#control");

	await visit(page, url);
	await wait(page, 200);
	await nextFrame(page);
	await nextFrame(page);
	await trigger(parent, "pointerdown", 5, 10);
	await wait(page, 50);
	await trigger(parent, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(parent, "pointermove", 200, 10);
	await nextFrame(page);
	await should(() =>
		// Should have only moved 10 px to the top
		expectBbox(parent, {
			top: 100,
			left: 250,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 150,
			left: 300,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 200, left: 350 }));
	await trigger(parent, "pointerup");
	await wait(page, 2000);
	await should(() =>
		// Should have only moved 10 px to the top
		expectBbox(parent, {
			top: 100,
			left: 200,
			width: 300,
			height: 300,
		})
	);
	await should(() =>
		expectBbox(child, {
			top: 150,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 200, left: 300 }));
	await trigger(child, "pointerdown", 5, 10);
	await wait(page, 50);
	await trigger(child, "pointermove", 10, 10); // Gesture will start from first move past threshold
	await nextFrame(page);
	await trigger(child, "pointermove", 200, 10);
	await nextFrame(page);
	await should(() =>
		expectBbox(child, {
			top: 150,
			left: 400,
			width: 600,
			height: 200,
		})
	);
	await trigger(child, "pointerup");
	await wait(page, 2000);
	await should(() =>
		expectBbox(child, {
			top: 150,
			left: 350,
			width: 600,
			height: 200,
		})
	);
}

async function testAlternateAxes(page: Page, parentLayout: boolean, childLayout: boolean) {
	let url = `?test=drag-layout-nested&bothAxes=true`;
	if (parentLayout) url += `&parentLayout=true`;
	if (childLayout) url += `&childLayout=true`;

	const parent = page.locator("#parent");
	const child = page.locator("#child");
	const control = page.locator("#control");

	await visit(page, url);
	await wait(page, 200);
	await nextFrame(page);
	await nextFrame(page);
	await trigger(child, "pointerdown", 5, 5);
	await wait(page, 80);
	await trigger(child, "pointermove", 10, 10);
	await nextFrame(page);
	await trigger(child, "pointermove", 100, 100);
	await nextFrame(page);
	await should(() =>
		expectBbox(child, {
			top: 250,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 300, left: 300 }));
	await should(() =>
		expectBbox(parent, {
			top: 200,
			left: 100,
			width: 300,
			height: 300,
		})
	);
	await wait(page, 30);
	await trigger(child, "pointerup");
	await wait(page, 80);
	await should(() =>
		expectBbox(child, {
			top: 250,
			left: 250,
			width: 600,
			height: 200,
		})
	);
	await should(() => expectBbox(control, { top: 300, left: 300 }));
	await should(() =>
		expectBbox(parent, {
			top: 200,
			left: 100,
			width: 300,
			height: 300,
		})
	);
}

test.describe("Nested drag with alternate draggable axes", () => {
	/**
	 * Skipping for now as there are still issues when either draggable
	 * component is also involved in layout animation
	 */
	test("Parent: layout, Child: layout", ({ page }) => testAlternateAxes(page, true, true));
	test("Parent: layout", ({ page }) => testAlternateAxes(page, true, false));
	test("Child: layout", ({ page }) => testAlternateAxes(page, false, true));
	test("Neither", ({ page }) => testAlternateAxes(page, false, false));
});

test.describe("Nested drag with constraints and animation", () => {
	test("Parent: layout, Child: layout", ({ page }) => testNestedDragConstraintsAndAnimation(page, true, true));
	test("Parent: layout", ({ page }) => testNestedDragConstraintsAndAnimation(page, true, false));
	test("Child: layout", ({ page }) => testNestedDragConstraintsAndAnimation(page, false, true));
	test("Neither", ({ page }) => testNestedDragConstraintsAndAnimation(page, false, false));
});
